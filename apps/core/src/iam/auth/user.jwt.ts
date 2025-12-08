import { Role } from '@repo/system/iam/roles';
import { DecodedIdToken } from 'node_modules/firebase-admin/lib/auth/token-verifier';

export class UserJwt implements DecodedIdToken {
  /**
   * The user's ID in our database
   */
  appId: string;
  role: Role;

  // Default fields:
  sub: string;
  name: string;
  email: string;

  // -- Other Firebase fields
  [key: string]: any;
  aud: string;
  auth_time: number;
  email_verified?: boolean;
  exp: number;
  firebase: {
    [key: string]: any;
    identities: { [key: string]: any };
    sign_in_provider: string;
    sign_in_second_factor?: string;
    second_factor_identifier?: string;
    tenant?: string;
  };
  iat: number;
  iss: string;
  phone_number?: string;
  picture?: string;
  uid: string;
}
