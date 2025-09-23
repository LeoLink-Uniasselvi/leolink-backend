import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dtos';

export class ActivateUserResponseDto extends SuccessResponseDto {
  @ApiProperty({
    example: 'Usuário ativado com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;
}
