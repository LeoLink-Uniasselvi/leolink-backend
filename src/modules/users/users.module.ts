import { Module, OnApplicationBootstrap, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreateUserUseCase,
  IndexUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  SoftDeleteUserUseCase,
  ActivateUserUseCase,
  GenerateDefaultUserUseCase,
  FollowUserUseCase,
  UnfollowUserUseCase,
  GetFollowersUseCase,
  GetFollowingUseCase,
  GetFollowStatsUseCase,
} from './use-cases';
import { UserRepository } from './repositories/user.repository';
import { FollowRepository } from './repositories/follow.repository';
import { UserAdapter } from './user.adapter';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UserRepository,
    FollowRepository,
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
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetFollowersUseCase,
    GetFollowingUseCase,
    GetFollowStatsUseCase,
    UserAdapter,
  ],
  exports: [UserRepository, FollowRepository],
})
export class UsersModule implements OnApplicationBootstrap {
  constructor(private generateDefaultUserUseCase: GenerateDefaultUserUseCase) {}

  async onApplicationBootstrap() {
    await this.generateDefaultUserUseCase.execute();
  }
}
