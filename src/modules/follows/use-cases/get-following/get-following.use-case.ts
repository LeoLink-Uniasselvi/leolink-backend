import { Injectable, Inject } from '@nestjs/common';
import { FollowRepository } from '@/modules/follows/repositories/follow.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { GetFollowingResponseDto, GetFollowingQueryDto } from '@/modules/follows/dtos';
import { UserNotFoundException } from '@/modules/follows/exceptions/follow.exceptions';
import { UserAdapter } from '@/modules/users/user.adapter';
import type { IFollowRepository } from '@/modules/follows/repositories/follow.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';

@Injectable()
export class GetFollowingUseCase {
  constructor(
    @Inject(FollowRepository)
    private readonly followRepository: IFollowRepository,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userAdapter: UserAdapter,
  ) {}

  async execute(userId: string, query: GetFollowingQueryDto): Promise<GetFollowingResponseDto> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const { page = 1, limit = 10 } = query;
    
    const { following, total } = await this.followRepository.findFollowing(userId, page, limit);
    
    const followingDto = following.map(followingUser => 
      this.userAdapter.convertToDto(followingUser)
    );

    return new GetFollowingResponseDto(followingDto, total, page, limit);
  }
}