import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FollowRepository } from '../../repositories/follow.repository';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(followerId: string, followingId: string) {
    // Não pode deixar de seguir a si mesmo
    if (followerId === followingId) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Operação inválida',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar se está seguindo
    const isFollowing = await this.followRepository.isFollowing(followerId, followingId);
    if (!isFollowing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Você não está seguindo este usuário',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.followRepository.unfollow(followerId, followingId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Deixou de seguir o usuário com sucesso',
      data: {
        followerId,
        followingId,
        isFollowing: false,
      },
    };
  }
}
