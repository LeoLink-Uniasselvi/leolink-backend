import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '@/modules/users/dtos/shared/user.response.dto';

export class LoginDataDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    readOnly: true,
  })
  token!: string;

  @ApiProperty({ example: 'bearer', default: 'bearer', readOnly: true })
  tokenType = 'bearer' as const;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Horário de expiração do token de acesso',
    nullable: true,
    readOnly: true,
  })
  expiresAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Token de atualização quando emitido',
    example: 'def50200a1b2c3...',
    readOnly: true,
  })
  refreshToken?: string;

  @ApiProperty({ type: () => UserDto, readOnly: true })
  user!: UserDto;
}
