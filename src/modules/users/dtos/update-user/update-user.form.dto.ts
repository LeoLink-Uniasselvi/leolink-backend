import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { NamedDto } from '@/common/dtos/traits/named.dto';

class _UpdateUserFormDto extends NamedDto {
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email',
    },
  )
  email: string;
}

export class UpdateUserFormDto extends PartialType(_UpdateUserFormDto) {}
