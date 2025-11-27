import { Injectable, Inject } from '@nestjs/common';
import { FollowRepository } from '@/modules/follows/repositories/follow.repository';
import type { IFollowRepository } from '@/modules/follows/repositories/follow.repository';

@Injectable()
export class IsFollowingUseCase {
  constructor(
    @Inject(FollowRepository)
    private readonly followRepository: IFollowRepository,
  ) {}

  async execute(followerId: string, followeeId: string): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.followRepository.isFollowing(followerId, followeeId);
    
    return { isFollowing };
  }
}