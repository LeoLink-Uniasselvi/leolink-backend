import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';
import { Session } from '@/modules/auth/entities/session.entity';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  session?: Session;
}
