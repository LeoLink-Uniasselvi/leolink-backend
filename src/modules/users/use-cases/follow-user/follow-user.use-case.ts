import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { FollowRepository } from '../../repositories/follow.repository';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class FollowUserUseCase {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(followerId: string, followingId: string) {
    // Não pode seguir a si mesmo
    if (followerId === followingId) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Você não pode seguir a si mesmo',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar se o usuário a ser seguido existe
    const userToFollow = await this.userRepository.findById(followingId);
    if (!userToFollow) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar se já está seguindo
    const isFollowing = await this.followRepository.isFollowing(followerId, followingId);
    if (isFollowing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Você já está seguindo este usuário',
        },
        HttpStatus.CONFLICT,
      );
    }

    await this.followRepository.follow(followerId, followingId);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuário seguido com sucesso',
      data: {
        followerId,
        followingId,
        isFollowing: true,
      },
    };
  }
}
