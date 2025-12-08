import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Admin } from '@prisma/client';
import { DbService } from '../../libraries/db/db.service';
import { FirebaseService } from '../../libraries/firebase/firebase.service';
import { UserJwt } from '../auth/user.jwt';
import {
  AppUnauthorizedException,
  ExceptionUnauthorizedEnum,
  UserError,
  UserErrorsEnum,
} from '@repo/system/errors/global.exceptions';

@Injectable()
export class AdminService {
  constructor(
    private readonly dbService: DbService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getAuthUser(decodedToken: UserJwt): Promise<Admin> {
    const user = await this.dbService.admin.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      throw new AppUnauthorizedException(
        ExceptionUnauthorizedEnum.USER_NOT_REGISTERED,
      );
    }

    user.lastSeenAt = new Date();
    if (decodedToken.email && !user.email) user.email = decodedToken.email;
    if (decodedToken.name && !user.name) user.name = decodedToken.name;

    return await this.dbService.admin.update({
      where: { id: user.id },
      data: user,
    });
  }

  async loginAdmin(email: string, password: string): Promise<Admin> {
    // TODO: add the FirebaseAuthProvider in AdminJS: https://docs.adminjs.co/basics/authentication/firebaseauthprovider
    /*const user = await this.firebaseService.auth.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    */
    const admin = await this.dbService.admin.findUnique({ where: { email } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // TODO: add the FirebaseAuthProvider in AdminJS: https://docs.adminjs.co/basics/authentication/firebaseauthprovider
    if (password !== 'changeme') {
      throw new UnauthorizedException('Invalid password');
    }
    return admin;
  }
}
