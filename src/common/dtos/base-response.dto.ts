import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({ format: 'uuid', readOnly: true }) id!: string;
  @ApiProperty({ type: String, format: 'date-time', readOnly: true }) createdAt!: Date;
  @ApiProperty({ type: String, format: 'date-time', readOnly: true }) updatedAt!: Date;
}