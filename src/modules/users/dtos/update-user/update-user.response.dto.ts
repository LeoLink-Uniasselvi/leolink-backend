import { UserResponseDto } from '@/modules/users/dtos/shared/user.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponseDto extends UserResponseDto {
  @ApiProperty({ example: 'User updated successfully', readOnly: true })
  message!: string;
}
