import { ApiProperty } from '@nestjs/swagger';

export class BaseEntityDto {
  @ApiProperty({
    format: 'uuid',
    readOnly: true,
    description: 'Identificador único',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    readOnly: true,
    description: 'Timestamp de criação',
    example: '2025-09-22T10:30:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    readOnly: true,
    description: 'Timestamp da última atualização',
    example: '2025-09-22T10:30:00Z',
  })
  updatedAt!: Date;
}
