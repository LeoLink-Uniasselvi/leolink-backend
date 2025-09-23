import { Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@Injectable()
export class MeUseCase {
  execute(jwtPayload: JwtPayload): BaseResponseDto<UserDto> {
    return {
      data: jwtPayload.user,
      message: 'Informações do usuário recuperadas com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
