import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SuccessResponseDto } from '@/common/dtos';

export class DeletePostResponseDto extends SuccessResponseDto {
  @ApiProperty({ example: 'Post deletado com sucesso' })
  declare message: string;
}
