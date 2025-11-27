import { ApiProperty } from '@nestjs/swagger';

export class UnfollowUserResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Deixou de seguir o usuário com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'ID do usuário que deixou de seguir',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  followerId: string;

  @ApiProperty({
    description: 'ID do usuário que foi deixado de seguir',
    example: '987fcdeb-51a2-43d1-b234-567890abcdef',
  })
  followeeId: string;

  constructor(followerId: string, followeeId: string) {
    this.message = 'Deixou de seguir o usuário com sucesso';
    this.followerId = followerId;
    this.followeeId = followeeId;
  }
}