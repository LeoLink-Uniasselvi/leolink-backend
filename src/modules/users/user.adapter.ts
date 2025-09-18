import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dtos/shared/user.response.dto';
import { CreateUserDto } from './dtos';

@Injectable()
export class UserAdapter {
  convertToDto(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.deletedAt ? false : true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  convertCreateUserDtoToEntity(dto: CreateUserDto): User {
    return new User(dto.name, dto.email, dto.password);
  }
}
