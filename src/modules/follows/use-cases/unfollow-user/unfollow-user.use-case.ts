import { Injectable, Inject } from '@nestjs/common';
import { FollowRepository } from '@/modules/follows/repositories/follow.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { UnfollowUserResponseDto } from '@/modules/follows/dtos';
import { NotFollowingException, UserNotFoundException } from '@/modules/follows/exceptions/follow.exceptions';
import type { IFollowRepository } from '@/modules/follows/repositories/follow.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject(FollowRepository)
    private readonly followRepository: IFollowRepository,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(followerId: string, followeeId: string): Promise<UnfollowUserResponseDto> {
    // Verificar se o usuário existe
    const followeeUser = await this.userRepository.findById(followeeId);
    if (!followeeUser) {
      throw new UserNotFoundException();
    }

    // Verificar se está seguindo
    const existingFollow = await this.followRepository.findByFollowerAndFollowee(followerId, followeeId);
    if (!existingFollow) {
      throw new NotFollowingException();
    }

    // Remover o relacionamento
    await this.followRepository.delete(followerId, followeeId);

    return new UnfollowUserResponseDto(followerId, followeeId);
  }
}