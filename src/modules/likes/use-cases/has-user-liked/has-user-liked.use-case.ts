import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import type { ILikeRepository } from '@/modules/likes/repositories/like.repository';
import {
  HasUserLikedResponseDto,
  HasUserLikedDataDto,
} from '@/modules/likes/dtos';
import {
  InvalidLikeTargetException,
  LikeTargetNotFoundException,
} from '@/modules/likes/exceptions';
import { LikeTargetValidatorService } from '@/modules/likes/services/like-target-validator.service';

@Injectable()
export class HasUserLikedUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
    private readonly likeTargetValidator: LikeTargetValidatorService,
  ) {}

  async execute(
    userId: string | undefined,
    postId?: string,
    commentId?: string,
  ): Promise<HasUserLikedResponseDto> {
    if (!userId) {
      throw new InvalidLikeTargetException('Informe o userId para verificar a curtida');
    }

    const hasPostTarget = Boolean(postId);
    const hasCommentTarget = Boolean(commentId);

    if (hasPostTarget === hasCommentTarget) {
      throw new InvalidLikeTargetException(
        'Defina apenas postId ou commentId para verificar a curtida',
      );
    }

    if (postId) {
      await this.likeTargetValidator.ensurePostExists(postId);
      const like = await this.likeRepository.findByUserAndPost(userId, postId);
      return this.buildResponse(Boolean(like), like?.id ?? null);
    }

    if (commentId) {
      await this.likeTargetValidator.ensureCommentExists(commentId);
      const like = await this.likeRepository.findByUserAndComment(userId, commentId);
      return this.buildResponse(Boolean(like), like?.id ?? null);
    }

    throw new LikeTargetNotFoundException();
  }

  private buildResponse(liked: boolean, likeId: string | null): HasUserLikedResponseDto {
    const data: HasUserLikedDataDto = {
      liked,
      likeId,
    };

    return {
      data,
      message: 'Verificacao de curtida realizada com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
