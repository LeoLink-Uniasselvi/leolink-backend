import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import type { ILikeRepository } from '@/modules/likes/repositories/like.repository';
import { InvalidLikeTargetException } from '@/modules/likes/exceptions';
import {
  CommentLikesDataDto,
  GetCommentLikesResponseDto,
} from '@/modules/likes/dtos';
import { LikeAdapter } from '@/modules/likes/like.adapter';
import { LikeTargetValidatorService } from '@/modules/likes/services/like-target-validator.service';

@Injectable()
export class GetCommentLikesUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
    private readonly likeAdapter: LikeAdapter,
    private readonly likeTargetValidator: LikeTargetValidatorService,
  ) {}

  async execute(commentId?: string): Promise<GetCommentLikesResponseDto> {
    if (!commentId) {
      throw new InvalidLikeTargetException(
        'Informe o commentId para consultar as curtidas',
      );
    }

    await this.likeTargetValidator.ensureCommentExists(commentId);

    const likes = await this.likeRepository.findByComment(commentId);
    const count = await this.likeRepository.countByComment(commentId);

    const data: CommentLikesDataDto = {
      count,
      likes: this.likeAdapter.convertToDtoList(likes),
    };

    return {
      data,
      message: 'Curtidas do comentario recuperadas com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
