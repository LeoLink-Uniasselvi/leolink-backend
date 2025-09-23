import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@/common/dtos/paginated.dtos';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

export class IndexUsersResponseDto extends PaginatedResponseDto<UserDto> {
  constructor(
    users: UserDto[],
    meta: PaginationMetaDto,
    message: string = 'Usuários recuperados com sucesso',
  ) {
    super(users, meta, message);
  }
}
