import { Injectable, Inject } from '@nestjs/common';
import { FollowRepository } from '@/modules/follows/repositories/follow.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { GetFollowersResponseDto, GetFollowersQueryDto } from '@/modules/follows/dtos';
import { UserNotFoundException } from '@/modules/follows/exceptions/follow.exceptions';
import { UserAdapter } from '@/modules/users/user.adapter';
import type { IFollowRepository } from '@/modules/follows/repositories/follow.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';

@Injectable()
export class GetFollowersUseCase {
  constructor(
    @Inject(FollowRepository)
    private readonly followRepository: IFollowRepository,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(userId: string, query: GetFollowersQueryDto): Promise<GetFollowersResponseDto> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const { page = 1, limit = 10 } = query;
    
    const { followers, total } = await this.followRepository.findFollowers(userId, page, limit);
    
    const followersDto = followers.map(follower => 
      this.userAdapter.convertToDto(follower)
    );

    return new GetFollowersResponseDto(followersDto, total, page, limit);
  }
}