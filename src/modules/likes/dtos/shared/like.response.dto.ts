import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityDto } from '@/common/dtos/base-entity.dto';

export type LikeTargetType = 'post' | 'comment';

export class LikeDto extends BaseEntityDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Identificador do usuario que realizou a curtida',
    example: '01953132-0b30-7cae-b97a-7af819689e00',
    readOnly: true,
  })
  userId!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Identificador do post curtido quando aplicavel',
    example: '01953132-0b30-7cae-b97a-7af819689e10',
    readOnly: true,
    nullable: true,
  })
  postId?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Identificador do comentario curtido quando aplicavel',
    example: '01953132-0b30-7cae-b97a-7af819689e11',
    readOnly: true,
    nullable: true,
  })
  commentId?: string | null;

  @ApiProperty({
    enum: ['post', 'comment'],
    description: 'Tipo da curtida',
    example: 'post',
    readOnly: true,
  })
  targetType!: LikeTargetType;
}
