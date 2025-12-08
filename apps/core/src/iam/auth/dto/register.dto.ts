import { IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  /**
   * The Apple token to register the user
   */
  @IsString()
  @IsOptional()
  appleToken?: string;

  /**
   * The Apple token nonce used to register the user
   */
  @IsString()
  @IsOptional()
  appleTokenNonce?: string;

  /**
   * The Google token to register the user
   */
  @IsString()
  @IsOptional()
  googleToken?: string;

  /**
   * The FCM token to register the user
   */
  @IsString()
  @IsOptional()
  fcmToken?: string;

  /**
   * The name of the user.
   * This is optional and can be used to set the user's display name.
   */
  @IsString()
  @IsOptional()
  name?: string;
}
