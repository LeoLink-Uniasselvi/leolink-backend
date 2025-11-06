import { Inject, Injectable } from '@nestjs/common';
import { BaseResponseDto } from '@/common/dtos';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import type { ILikeRepository } from '@/modules/likes/repositories/like.repository';
import { InvalidLikeTargetException } from '@/modules/likes/exceptions';
import {
  GetPostLikesResponseDto,
  PostLikesDataDto,
} from '@/modules/likes/dtos';
import { LikeAdapter } from '@/modules/likes/like.adapter';
import { LikeTargetValidatorService } from '@/modules/likes/services/like-target-validator.service';

@Injectable()
export class GetPostLikesUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
    private readonly likeAdapter: LikeAdapter,
    private readonly likeTargetValidator: LikeTargetValidatorService,
  ) {}

  async execute(postId?: string): Promise<GetPostLikesResponseDto> {
    if (!postId) {
      throw new InvalidLikeTargetException('Informe o postId para consultar as curtidas');
    }

    await this.likeTargetValidator.ensurePostExists(postId);

    const likes = await this.likeRepository.findByPost(postId);
    const count = await this.likeRepository.countByPost(postId);

    const data: PostLikesDataDto = {
      count,
      likes: this.likeAdapter.convertToDtoList(likes),
    };

    return {
      data,
      message: 'Curtidas do post recuperadas com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
