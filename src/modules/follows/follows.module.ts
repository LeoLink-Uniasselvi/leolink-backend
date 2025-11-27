import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '@/modules/users/entities/user.entity';
import { FollowRepository } from './repositories/follow.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserAdapter } from '@/modules/users/user.adapter';
import { FollowsController } from './follows.controller';
import {
  FollowUserUseCase,
  UnfollowUserUseCase,
  GetFollowersUseCase,
  GetFollowingUseCase,
  GetFollowersCountUseCase,
  GetFollowingCountUseCase,
  IsFollowingUseCase,
} from './use-cases';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow, User]),
  ],
  controllers: [FollowsController],
  providers: [
    // Repositories
    FollowRepository,
    UserRepository,
    
    // Adapters
    UserAdapter,
    
    // Use Cases
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetFollowersUseCase,
    GetFollowingUseCase,
    GetFollowersCountUseCase,
    GetFollowingCountUseCase,
    IsFollowingUseCase,
  ],
  exports: [
    FollowRepository,
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetFollowersUseCase,
    GetFollowingUseCase,
    GetFollowersCountUseCase,
    GetFollowingCountUseCase,
    IsFollowingUseCase,
  ],
})
export class FollowsModule {}