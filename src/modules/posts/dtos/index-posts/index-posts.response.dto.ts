import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDataDto, PaginationMetaDto } from '@/common/dtos';
import { PostDataDto } from '../post-data.dto';

export class IndexPostsResponseDto {
  @ApiProperty({ type: [PostDataDto] })
  items!: PostDataDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
