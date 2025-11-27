import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

export class FollowDto {
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

  @ApiProperty({
    description: 'Dados do usuário seguidor',
    type: UserDto,
  })
  follower?: UserDto;

  @ApiProperty({
    description: 'Dados do usuário seguido',
    type: UserDto,
  })
  followee?: UserDto;
}