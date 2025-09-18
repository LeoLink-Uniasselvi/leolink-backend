import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export function IsPassword(propertyName = 'Password') {
  return applyDecorators(
    IsNotEmpty({ message: `${propertyName} is required` }),
    IsString({ message: `${propertyName} must be a string` }),
    Length(8, 255, {
      message: `${propertyName} must be at least 8 characters long`,
    }),
    Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: `${propertyName} must contain at least one uppercase letter, one lowercase letter, and one number or special character`,
    }),
  );
}
