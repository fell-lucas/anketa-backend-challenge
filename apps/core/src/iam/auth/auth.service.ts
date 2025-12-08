import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
} from '@repo/system/errors/global.exceptions';
import { Role } from '@repo/system/iam/roles';
import { AppleService } from 'src/libraries/apple/apple.service';
import { AppConfigService } from 'src/libraries/config/app.config.service';
import { DbService } from 'src/libraries/db/db.service';
import { GoogleService } from 'src/libraries/google/google.service';
import { FirebaseService } from '../../libraries/firebase/firebase.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UserService } from '../user/user.service';
import { AuthRequest } from './auth.request';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UserService,
    private readonly appleService: AppleService,
    private readonly googleService: GoogleService,
    private readonly dbService: DbService,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * Check if signup is allowed based on founder email configuration
   * */
  async checkSignupAllowed(email?: string): Promise<boolean> {
    const founderEmail = this.configService.auth.founderEmail;
    if (!founderEmail) {
      // If no founder email is configured, allow all signups
      return true;
    }

    // If this is the founder trying to sign up, allow it
    if (email && email.toLowerCase() === founderEmail.toLowerCase()) {
      return true;
    }

    // Check if founder has already signed up
    const founderExists = await this.dbService.user.findFirst({
      where: {
        email: founderEmail,
        deletedAt: null,
      },
    });

    return !!founderExists;
  }

  async loginOrSignup(request: AuthRequest, data: RegisterDto): Promise<User> {
    // We need the access token to checkRevoked in verifyIdToken:
    const accessToken = request.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_ACCESS_TOKEN,
      );
    }

    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(
        accessToken,
        true,
      );
    } catch (error) {
      this.logger.error(error, 'Error verifying ID token');
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.INVALID_ACCESS_TOKEN,
      );
    }

    // Check if this is a new user signup and if it's allowed
    const existingUser = await this.dbService.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    // If this is a new user, check if signup is allowed
    if (!existingUser) {
      const signupAllowed = await this.checkSignupAllowed(decodedToken.email);
      if (!signupAllowed) {
        throw new AppUnauthorizedException(
          ExceptionUnauthorizedEnum.SIGN_UP_TEMPORARILY_RESTRICTED,
        );
      }
    }

    // Validate tokens if provided:
    const userExtraData: RegisterUserDto = {};
    if (data.appleToken) {
      const appleDecodedToken = await this.appleService.verifyAppleIdToken(
        data.appleToken,
        data.appleTokenNonce,
      );
      userExtraData.appleToken = data.appleToken;
      userExtraData.appleUserId = appleDecodedToken.sub;
    }

    if (data.googleToken) {
      const googleDecodedToken = await this.googleService.verifyGoogleIdToken(
        data.googleToken,
      );
      userExtraData.googleToken = data.googleToken;
      userExtraData.googleUserId = googleDecodedToken.sub;
    }

    if (data.name) {
      userExtraData.name = data.name;
    }

    const user = await this.usersService.registerUser(
      decodedToken,
      userExtraData,
    );

    if (!decodedToken.appId || decodedToken.appId !== user.id) {
      const customClaims = {
        appId: user.id,
        role: Role.USER,
      };
      await this.firebaseService.setCustomClaims(
        decodedToken.uid,
        customClaims,
      );

      //NB: in the client we need to refresh the token to get the new custom claims
      Object.assign(decodedToken, customClaims);
    }

    // Register the user for the rest of this request:
    request.user = decodedToken;
    return user;
  }

  async changeEmail(request: AuthRequest): Promise<User> {
    // We need the access token to checkRevoked in verifyIdToken:
    const accessToken = request.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.MISSING_ACCESS_TOKEN,
      );
    }

    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(
        accessToken,
        true,
      );
    } catch (error) {
      this.logger.error(error, 'Error verifying ID token');
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.INVALID_ACCESS_TOKEN,
      );
    }

    return await this.usersService.changeEmail(decodedToken);
  }
}
