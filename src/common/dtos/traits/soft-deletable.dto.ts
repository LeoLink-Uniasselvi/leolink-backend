import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeletedAtResponseDto {
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deletedAt?: Date | null;
}