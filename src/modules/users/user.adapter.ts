import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from './dtos';
import { CreateUserFormDto } from './dtos';
import { RegisterFormDto } from '@/modules/auth/dtos';

@Injectable()
export class UserAdapter {
  convertToDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.name = user.name;
    userDto.email = user.email;
    userDto.isActive = user.deletedAt ? false : true;
    userDto.createdAt = user.createdAt;
    userDto.updatedAt = user.updatedAt;
    return userDto;
  }

  convertCreateUserDtoToEntity(dto: CreateUserFormDto | RegisterFormDto): User {
    return new User(dto.name, dto.email, dto.password);
  }
}
