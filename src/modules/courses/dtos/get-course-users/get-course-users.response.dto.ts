import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { UserDto } from '@/modules/users/dtos';

export class GetCourseUsersResponseDto extends BaseResponseDto<UserDto[]> {
  @ApiProperty({ type: [UserDto] })
  declare data: UserDto[];
}

