import { Module, OnApplicationBootstrap, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreateUserUseCase,
  IndexUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  SoftDeleteUserUseCase,
  ActivateUserUseCase,
  GenerateDefaultUserUseCase,
} from './use-cases';
import { UserRepository } from './repositories/user.repository';
import { UserAdapter } from './user.adapter';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UserRepository,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    CreateUserUseCase,
    IndexUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    SoftDeleteUserUseCase,
    ActivateUserUseCase,
    GenerateDefaultUserUseCase,
    UserAdapter,
  ],
})
export class UsersModule implements OnApplicationBootstrap {
  constructor(private generateDefaultUserUseCase: GenerateDefaultUserUseCase) {}

  async onApplicationBootstrap() {
    await this.generateDefaultUserUseCase.execute();
  }
}
