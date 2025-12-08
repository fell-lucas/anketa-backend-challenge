import { Device, Session } from '@prisma/client';
import { Request as HttpRequest } from 'express';
import { UserJwt } from './user.jwt';

export type AuthRequest = HttpRequest & {
  user: UserJwt;
  device?: Device;
  appSession?: Session;
};
