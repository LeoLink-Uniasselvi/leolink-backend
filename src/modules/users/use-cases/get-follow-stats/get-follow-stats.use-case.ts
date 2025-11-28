import { HttpStatus, Injectable } from '@nestjs/common';
import { FollowRepository } from '../../repositories/follow.repository';

@Injectable()
export class GetFollowStatsUseCase {
  constructor(private followRepository: FollowRepository) {}

  async execute(userId: string, currentUserId?: string) {
    const [followersCount, followingCount] = await Promise.all([
      this.followRepository.getFollowersCount(userId),
      this.followRepository.getFollowingCount(userId),
    ]);

    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      isFollowing = await this.followRepository.isFollowing(currentUserId, userId);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Estatísticas obtidas com sucesso',
      data: {
        followersCount,
        followingCount,
        isFollowing,
      },
    };
  }
}
