import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from '@/modules/users/dtos/shared/user.response.dto';

export class LoginResponseDto {
  @ApiProperty({ example: 'Login successful', readOnly: true })
  message!: string;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    readOnly: true,
  })
  token!: string;

  @ApiProperty({ example: 'bearer', default: 'bearer', readOnly: true })
  tokenType = 'bearer' as const;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Access token expiration time (server clock)',
    nullable: true,
    readOnly: true,
  })
  expiresAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Refresh token when issued',
    example: 'def50200a1b2c3...',
    readOnly: true,
  })
  refreshToken?: string;

  @ApiProperty({ type: () => UserResponseDto, readOnly: true })
  user!: UserResponseDto;

  constructor(init?: Partial<LoginResponseDto>) {
    Object.assign(this, init);
  }
}
