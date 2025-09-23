import { BaseResponseDto } from '@/common/dtos';

export class LogoutResponseDto extends BaseResponseDto<null> {
  constructor(
    message: string = 'Logout realizado com sucesso',
    statusCode: number = 200,
  ) {
    super(null, message, statusCode);
  }
}
