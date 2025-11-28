import { HttpStatus, Injectable } from '@nestjs/common';
import { FollowRepository } from '../../repositories/follow.repository';

@Injectable()
export class GetFollowersUseCase {
  constructor(private followRepository: FollowRepository) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    const { items, total } = await this.followRepository.getFollowers(userId, page, limit);
    
    const followers = items.map(follow => ({
      id: follow.follower.id,
      name: follow.follower.name,
      email: follow.follower.email,
      followedAt: follow.createdAt,
    }));

    return {
      statusCode: HttpStatus.OK,
      message: 'Seguidores obtidos com sucesso',
      items: followers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
