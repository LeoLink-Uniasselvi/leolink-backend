import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dtos/success-response.dto';

/**
 * Resposta padrão para a remoção (soft delete) de um comentário.
 */
export class DeleteCommentResponseDto extends SuccessResponseDto {
  @ApiProperty({
    example: 'Comentário removido com sucesso',
    description: 'Mensagem de sucesso',
  })
  declare message: string;
}