import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dtos';

export class RemoveLikeResponseDto extends SuccessResponseDto {
  @ApiProperty({
    example: 'Curtida removida com sucesso',
    description: 'Mensagem de confirmacao',
  })
  declare message: string;
}
