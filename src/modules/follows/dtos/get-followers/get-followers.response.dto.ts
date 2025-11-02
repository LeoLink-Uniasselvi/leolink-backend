import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

export class GetFollowersResponseDto {
  @ApiProperty({
    description: 'Lista de seguidores',
    type: [UserDto],
  })
  followers: UserDto[];

  @ApiProperty({
    description: 'Total de seguidores',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 15,
  })
  totalPages: number;

  constructor(followers: UserDto[], total: number, page: number, limit: number) {
    this.followers = followers;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}