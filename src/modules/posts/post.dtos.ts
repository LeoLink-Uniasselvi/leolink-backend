import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseEntityDto } from '@/common/dtos/base-entity.dto';
import { DeletedAtResponseDto } from '@/common/dtos/traits/soft-deletable.dto';
import {
  PaginationQueryDto,
  PaginatedDataDto,
  PaginatedResponseDto,
} from '@/common/dtos/paginated.dtos';
import { BaseResponseDto } from '@/common/dtos';

export class CategoryDto extends BaseEntityDto {
  @ApiProperty({
    example: 'Engenharia de Software',
    description: 'Nome da categoria',
  })
  name!: string;
}

export class PostDto extends BaseEntityDto implements DeletedAtResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Identificador do autor',
  })
  authorId!: string;

  @ApiProperty({
    description: 'Conteudo textual do post',
  })
  content!: string;

  @ApiPropertyOptional({
    description: 'URL da imagem associada (upload externo ou link)',
    nullable: true,
  })
  imageUrl?: string | null;

  @ApiProperty({
    description: 'Flag indicando se o post e institucional',
    default: false,
  })
  isInstitutional!: boolean;

  @ApiPropertyOptional({
    description: 'Categorias associadas ao post',
    type: () => [CategoryDto],
  })
  categories?: CategoryDto[];

  @ApiPropertyOptional({
    description: 'Quantidade de visualizacoes registradas',
    example: 42,
  })
  viewsCount?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de comentarios (soft delete ignorado)',
    example: 3,
  })
  commentsCount?: number;

  @ApiPropertyOptional({
    description: 'Timestamp de exclusao (soft delete)',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  deletedAt?: Date | null;
}

export class PostIdParamDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Identificador do post',
  })
  @IsUUID(undefined, { message: 'postId deve ser um UUID valido' })
  postId!: string;
}

export class CreatePostFormDto {
  @ApiProperty({
    description: 'Conteudo do post',
    example: 'Nova publicacao sobre IA generativa',
    minLength: 1,
  })
  @IsString({ message: 'content deve ser uma string' })
  @IsNotEmpty({ message: 'content nao pode estar vazio' })
  @MaxLength(2000, { message: 'content deve ter no maximo 2000 caracteres' })
  content!: string;

  @ApiPropertyOptional({
    description: 'URL da imagem (ou link externo)',
    example: 'https://exemplo.com/imagem.png',
    nullable: true,
  })
  @IsOptional()
  @IsUrl({}, { message: 'imageUrl deve ser uma URL valida' })
  imageUrl?: string | null;

  @ApiPropertyOptional({
    description: 'Indica se a publicacao e institucional',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isInstitutional deve ser booleano' })
  isInstitutional?: boolean = false;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Lista de categorias a associar',
    nullable: true,
  })
  @IsOptional()
  @IsArray({ message: 'categoryIds deve ser um array' })
  @ArrayUnique({ message: 'categoryIds nao pode ter duplicados' })
  @IsUUID(undefined, { each: true, message: 'Cada categoryId deve ser UUID' })
  categoryIds?: string[];
}

export class UpdatePostFormDto {
  @ApiPropertyOptional({
    description: 'Conteudo do post',
    example: 'Atualizacao do post',
  })
  @IsOptional()
  @IsString({ message: 'content deve ser uma string' })
  @MaxLength(2000, { message: 'content deve ter no maximo 2000 caracteres' })
  content?: string;

  @ApiPropertyOptional({
    description: 'URL da imagem (ou link externo)',
    example: 'https://exemplo.com/imagem.png',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((obj, value) => value !== null)
  @IsUrl({}, { message: 'imageUrl deve ser uma URL valida' })
  imageUrl?: string | null;

  @ApiPropertyOptional({
    description: 'Flag institucional',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isInstitutional deve ser booleano' })
  isInstitutional?: boolean;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Substitui as categorias do post',
    nullable: true,
  })
  @IsOptional()
  @IsArray({ message: 'categoryIds deve ser um array' })
  @ArrayUnique({ message: 'categoryIds nao pode ter duplicados' })
  @IsUUID(undefined, { each: true, message: 'Cada categoryId deve ser UUID' })
  categoryIds?: string[];
}

export class ListPostsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filtra posts pelo autor',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'authorId deve ser UUID valido' })
  authorId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filtra posts por categoria',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'categoryId deve ser UUID valido' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filtra posts institucionais',
  })
  @IsOptional()
  @IsBoolean({ message: 'isInstitutional deve ser booleano' })
  isInstitutional?: boolean;
}

export class FeedPostsQueryDto {
  @ApiPropertyOptional({
    description: 'Cursor no formato <ISODate>:<postId>',
    example: '2025-01-01T10:00:00.000Z:01953132-0b30-7cae-b97a-7af819689e21',
  })
  @IsOptional()
  @IsString({ message: 'cursor deve ser string' })
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Limite de itens retornados',
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

export class ManageCategoriesDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    description: 'Categorias a adicionar/remover',
  })
  @IsArray({ message: 'categoryIds deve ser um array' })
  @ArrayNotEmpty({ message: 'categoryIds nao pode ser vazio' })
  @ArrayUnique({ message: 'categoryIds nao pode ter duplicados' })
  @IsUUID(undefined, { each: true, message: 'Cada categoryId deve ser UUID' })
  categoryIds!: string[];
}

export class PostViewStatsDto {
  @ApiProperty({ example: 12, description: 'Total de visualizacoes' })
  totalViews!: number;

  @ApiProperty({
    example: 10,
    description: 'Total de usuarios unicos que visualizaram',
  })
  uniqueUsers!: number;
}

export class CreatePostResponseDto extends BaseResponseDto<PostDto> {
  @ApiProperty({ type: PostDto })
  declare data: PostDto;
}

export class UpdatePostResponseDto extends BaseResponseDto<PostDto> {
  @ApiProperty({ type: PostDto })
  declare data: PostDto;
}

export class GetPostResponseDto extends BaseResponseDto<PostDto> {
  @ApiProperty({ type: PostDto })
  declare data: PostDto;
}

export class DeletePostResponseDto extends BaseResponseDto<PostDto> {
  @ApiProperty({ type: PostDto })
  declare data: PostDto;
}

export class ListPostsResponseDto extends PaginatedResponseDto<PostDto> {
  @ApiProperty({ type: () => PaginatedDataDto<PostDto> })
  declare data: PaginatedDataDto<PostDto>;
}

export class FeedMetaDto {
  @ApiPropertyOptional({
    description: 'Cursor para a proxima pagina',
    nullable: true,
  })
  nextCursor?: string | null;

  @ApiProperty({
    description: 'Limite utilizado',
    example: 10,
  })
  limit!: number;
}

export class FeedResponseDto extends BaseResponseDto<{
  items: PostDto[];
  meta: FeedMetaDto;
}> {
  @ApiProperty({
    type: () => PostDto,
    isArray: true,
  })
  declare data: { items: PostDto[]; meta: FeedMetaDto };
}

export class ManageCategoriesResponseDto extends BaseResponseDto<PostDto> {
  @ApiProperty({ type: PostDto })
  declare data: PostDto;
}

export class PostViewsResponseDto extends BaseResponseDto<PostViewStatsDto> {
  @ApiProperty({ type: PostViewStatsDto })
  declare data: PostViewStatsDto;
}
