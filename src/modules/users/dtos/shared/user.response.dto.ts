import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'João Silva', readOnly: true })
  name!: string;

  @ApiProperty({ example: 'joao@example.com', readOnly: true })
  email!: string;

  @ApiProperty({ example: true, readOnly: true })
  isActive!: boolean;

  constructor(init?: Partial<UserResponseDto>) {
    super();
    Object.assign(this, init);
  }
}
