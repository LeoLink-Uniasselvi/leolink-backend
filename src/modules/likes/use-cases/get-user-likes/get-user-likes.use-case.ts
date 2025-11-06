import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import type { ILikeRepository } from '@/modules/likes/repositories/like.repository';
import { InvalidLikeTargetException } from '@/modules/likes/exceptions';
import {
  GetUserLikesResponseDto,
  UserLikesDataDto,
} from '@/modules/likes/dtos';
import { LikeAdapter } from '@/modules/likes/like.adapter';

@Injectable()
export class GetUserLikesUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
    private readonly likeAdapter: LikeAdapter,
  ) {}

  async execute(userId?: string): Promise<GetUserLikesResponseDto> {
    if (!userId) {
      throw new InvalidLikeTargetException('Informe o userId para consultar as curtidas');
    }

    const likes = await this.likeRepository.findByUser(userId);
    const likeDtos = this.likeAdapter.convertToDtoList(likes);

    const posts = likeDtos.filter((like) => like.targetType === 'post');
    const comments = likeDtos.filter((like) => like.targetType === 'comment');

    const data: UserLikesDataDto = {
      posts,
      comments,
      total: likeDtos.length,
    };

    return {
      data,
      message: 'Curtidas do usuario recuperadas com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
