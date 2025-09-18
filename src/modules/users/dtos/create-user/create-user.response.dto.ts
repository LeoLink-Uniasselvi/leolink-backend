import { UserResponseDto } from '@/modules/users/dtos/shared/user.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto extends UserResponseDto {
  @ApiProperty({ example: 'User created successfully', readOnly: true })
  message!: string;
}
