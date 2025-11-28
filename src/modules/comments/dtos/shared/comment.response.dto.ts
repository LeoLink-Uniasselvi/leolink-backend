import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityDto } from '@/common/dtos/base-entity.dto';
import { DeletedAtResponseDto } from '@/common/dtos/traits/soft-deletable.dto';

class CommentAuthorDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'João Silva' })
  name!: string;

  @ApiProperty({ example: 'joao@example.com' })
  email!: string;
}

/**
 * CommentDto is the base representation of a comment returned by the API.
 * It includes identifiers for the associated post and author, the parent
 * identifier when applicable, the comment text and optional deletion
 * timestamp. In hierarchical responses the `replies` property will
 * contain child comments and `repliesCount` indicates how many direct
 * replies exist, even if they are not fully included in the payload.
 */
export class CommentDto extends BaseEntityDto implements DeletedAtResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Identificador do post associado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  postId!: string;

  @ApiProperty({
    format: 'uuid',
    description: 'Identificador do autor do comentário',
    example: '01923456-7890-7abc-def0-123456789abc',
  })
  authorId!: string;

  @ApiProperty({
    description: 'Dados do autor',
    type: CommentAuthorDto,
  })
  author!: CommentAuthorDto;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
    description: 'Identificador do comentário pai (se for uma resposta)',
    example: '321e4567-e89b-12d3-a456-426614174000',
  })
  parentId?: string | null;

  @ApiProperty({
    description: 'Conteúdo textual do comentário',
    example: 'Muito interessante este artigo!',
  })
  content!: string;

  @ApiPropertyOptional({
    description: 'Timestamp de exclusão (soft delete)',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  deletedAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Número de respostas diretas a este comentário',
    example: 3,
  })
  repliesCount?: number;

  @ApiPropertyOptional({
    description: 'Lista de respostas deste comentário',
    type: () => [CommentDto],
  })
  replies?: CommentDto[];
}