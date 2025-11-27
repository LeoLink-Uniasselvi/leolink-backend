import { Injectable, Inject } from '@nestjs/common';
import { FollowRepository } from '@/modules/follows/repositories/follow.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UserNotFoundException } from '@/modules/follows/exceptions/follow.exceptions';
import type { IFollowRepository } from '@/modules/follows/repositories/follow.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';

@Injectable()
export class GetFollowingCountUseCase {
  constructor(
    @Inject(FollowRepository)
    private readonly followRepository: IFollowRepository,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<{ count: number }> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const count = await this.followRepository.countFollowing(userId);
    
    return { count };
  }
}