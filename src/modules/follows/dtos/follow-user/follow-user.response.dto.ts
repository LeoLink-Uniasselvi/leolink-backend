import { ApiProperty } from '@nestjs/swagger';

export class FollowUserResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Usuário seguido com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'ID do usuário seguidor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  followerId: string;

  @ApiProperty({
    description: 'ID do usuário seguido',
    example: '987fcdeb-51a2-43d1-b234-567890abcdef',
  })
  followeeId: string;

  @ApiProperty({
    description: 'Data quando começou a seguir',
    example: '2025-11-01T20:30:00.000Z',
  })
  createdAt: Date;

  constructor(followerId: string, followeeId: string, createdAt: Date) {
    this.message = 'Usuário seguido com sucesso';
    this.followerId = followerId;
    this.followeeId = followeeId;
    this.createdAt = createdAt;
  }
}