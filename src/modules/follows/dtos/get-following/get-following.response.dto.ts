import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

export class GetFollowingResponseDto {
  @ApiProperty({
    description: 'Lista de usuários seguindo',
    type: [UserDto],
  })
  following: UserDto[];

  @ApiProperty({
    description: 'Total de usuários seguindo',
    example: 85,
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
    example: 9,
  })
  totalPages: number;

  constructor(following: UserDto[], total: number, page: number, limit: number) {
    this.following = following;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}