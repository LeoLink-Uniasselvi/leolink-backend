import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import type { ILikeRepository } from '@/modules/likes/repositories/like.repository';
import { LikeNotFoundException, InvalidLikeTargetException } from '@/modules/likes/exceptions';
import { RemoveLikeResponseDto } from '@/modules/likes/dtos';

@Injectable()
export class UnlikePostUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
  ) {}

  async execute(userId: string, postId?: string): Promise<RemoveLikeResponseDto> {
    if (!postId) {
      throw new InvalidLikeTargetException('Informe o postId para remover a curtida');
    }

    const like = await this.likeRepository.findByUserAndPost(userId, postId);

    if (!like) {
      throw new LikeNotFoundException('Curtida do post nao encontrada para este usuario');
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
