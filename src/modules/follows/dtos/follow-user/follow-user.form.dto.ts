import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FollowUserFormDto {
  @ApiProperty({
    description: 'ID do usuário a ser seguido',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({
    message: 'O ID do usuário é obrigatório',
  })
  @IsUUID('4', {
    message: 'O ID deve ser um UUID válido',
  })
  followeeId: string;
}