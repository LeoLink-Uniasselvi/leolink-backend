import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import type { ILikeRepository } from '@/modules/likes/repositories/like.repository';
import {
  InvalidLikeTargetException,
  LikeNotFoundException,
} from '@/modules/likes/exceptions';
import { RemoveLikeResponseDto } from '@/modules/likes/dtos';

@Injectable()
export class UnlikeCommentUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
  ) {}

  async execute(userId: string, commentId?: string): Promise<RemoveLikeResponseDto> {
    if (!commentId) {
      throw new InvalidLikeTargetException('Informe o commentId para remover a curtida');
    }

    const like = await this.likeRepository.findByUserAndComment(userId, commentId);

    if (!like) {
      throw new LikeNotFoundException('Curtida do comentario nao encontrada para este usuario');
    }

    await this.likeRepository.delete(like.id);

    return {
      data: null,
      message: 'Curtida removida com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
