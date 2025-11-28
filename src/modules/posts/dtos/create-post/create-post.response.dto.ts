import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { PostDataDto } from '../post-data.dto';
import { HttpStatus } from '@nestjs/common';

export class CreatePostResponseDto extends BaseResponseDto<PostDataDto> {
  @ApiProperty({ type: PostDataDto })
  declare data: PostDataDto;

  @ApiProperty({ example: 'Post criado com sucesso' })
  declare message: string;

  @ApiProperty({ example: HttpStatus.CREATED })
  declare statusCode: number;

  @ApiProperty({ example: '2025-11-26T12:00:00Z' })
  declare timestamp: string;
}
