import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dtos';

export class DeleteUserResponseDto extends SuccessResponseDto {
  @ApiProperty({
    example: 'Usuário removido com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;
}
