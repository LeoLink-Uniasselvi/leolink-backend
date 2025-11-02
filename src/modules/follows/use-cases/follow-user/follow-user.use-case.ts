import { Injectable, Inject } from '@nestjs/common';
import { Follow } from '@/modules/follows/entities/follow.entity';
import { FollowRepository } from '@/modules/follows/repositories/follow.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { FollowUserResponseDto } from '@/modules/follows/dtos';
import type { IFollowRepository } from '@/modules/follows/repositories/follow.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { 
  CannotFollowSelfException, 
  AlreadyFollowingException, 
  UserNotFoundException 
} from '@/modules/follows/exceptions/follow.exceptions';

@Injectable()
export class FollowUserUseCase {
  constructor(
    @Inject(FollowRepository)
    private readonly followRepository: IFollowRepository,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(followerId: string, followeeId: string): Promise<FollowUserResponseDto> {
    // Validação: não pode seguir a si mesmo
    if (followerId === followeeId) {
      throw new CannotFollowSelfException();
    }

    // Verificar se o usuário a ser seguido existe
    const followeeUser = await this.userRepository.findById(followeeId);
    if (!followeeUser) {
      throw new UserNotFoundException();
    }

    // Verificar se já está seguindo
    const existingFollow = await this.followRepository.findByFollowerAndFollowee(followerId, followeeId);
    if (existingFollow) {
      throw new AlreadyFollowingException();
    }

    // Criar o relacionamento
    const follow = new Follow(followerId, followeeId);
    await this.followRepository.create(follow);

    return new FollowUserResponseDto(followerId, followeeId, follow.createdAt);
  }
}