import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class HasUserLikedQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Identificador do post para verificacao',
    example: '01953132-0b30-7cae-b97a-7af819689e10',
  })
  @IsOptional()
  @Matches(UUID_V7_REGEX, { message: 'postId must be a UUID v7' })
  postId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Identificador do comentario para verificacao',
    example: '01953132-0b30-7cae-b97a-7af819689e11',
  })
  @IsOptional()
  @Matches(UUID_V7_REGEX, { message: 'commentId must be a UUID v7' })
  commentId?: string;
}
