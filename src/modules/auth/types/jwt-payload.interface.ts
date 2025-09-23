import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

export interface JwtPayload {
  sub: string;
  user: UserDto;
  iat?: number;
  exp?: number;
}
