import { HttpStatus, Injectable } from '@nestjs/common';
import { FollowRepository } from '../../repositories/follow.repository';

@Injectable()
export class GetFollowingUseCase {
  constructor(private followRepository: FollowRepository) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    const { items, total } = await this.followRepository.getFollowing(userId, page, limit);
    
    const following = items.map(follow => ({
      id: follow.following.id,
      name: follow.following.name,
      email: follow.following.email,
      followedAt: follow.createdAt,
    }));

    return {
      statusCode: HttpStatus.OK,
      message: 'Seguindo obtidos com sucesso',
      items: following,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
