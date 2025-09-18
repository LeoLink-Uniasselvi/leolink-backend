import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  CreateUserUseCase,
  IndexUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  SoftDeleteUserUseCase,
  ActivateUserUseCase,
} from './use-cases';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private indexUsersUseCase: IndexUsersUseCase,
    private getUserUseCase: GetUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private softDeleteUserUseCase: SoftDeleteUserUseCase,
    private activateUserUseCase: ActivateUserUseCase,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  index() {
    return this.indexUsersUseCase.execute();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getUserUseCase.execute(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(+id, updateUserDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.softDeleteUserUseCase.execute(+id);
  }

  @Post(':id/activate')
  activate(@Param('id') id: string) {
    return this.activateUserUseCase.execute(+id);
  }
}
