import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from '@/common/dtos';

class PostAuthorDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'João Silva' })
  name!: string;

  @ApiProperty({ example: 'joao@example.com' })
  email!: string;
}

export class PostDataDto extends BaseEntityDto {
  @ApiProperty({
    description: 'Conteúdo do post',
    example: 'Este é o conteúdo do meu primeiro post!',
  })
  content!: string;

  @ApiProperty({
    description: 'ID do autor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  authorId!: string;

  @ApiProperty({
    description: 'Dados do autor',
    type: PostAuthorDto,
  })
  author!: PostAuthorDto;

  @ApiProperty({ description: 'Número de curtidas', example: 0 })
  likesCount!: number;

  @ApiProperty({ description: 'Número de comentários', example: 0 })
  commentsCount!: number;

  @ApiProperty({ description: 'Se o usuário atual curtiu o post', example: false, required: false })
  isLiked?: boolean;

  @ApiProperty({ description: 'Data de exclusão (soft delete)', nullable: true, required: false })
  deletedAt?: Date | null;
}
