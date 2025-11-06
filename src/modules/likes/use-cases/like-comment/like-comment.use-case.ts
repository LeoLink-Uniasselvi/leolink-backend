import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import type { ILikeRepository } from '@/modules/likes/repositories/like.repository';
import { LikeAdapter } from '@/modules/likes/like.adapter';
import { Like } from '@/modules/likes/entities/like.entity';
import {
  InvalidLikeTargetException,
  LikeAlreadyExistsException,
} from '@/modules/likes/exceptions';
import { CreateLikeResponseDto } from '@/modules/likes/dtos';
import { LikeTargetValidatorService } from '@/modules/likes/services/like-target-validator.service';

@Injectable()
export class LikeCommentUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
    private readonly likeAdapter: LikeAdapter,
    private readonly likeTargetValidator: LikeTargetValidatorService,
  ) {}

  async execute(userId: string, commentId?: string): Promise<CreateLikeResponseDto> {
    if (!commentId) {
      throw new InvalidLikeTargetException('Informe o commentId para registrar a curtida');
    }

    await this.likeTargetValidator.ensureCommentExists(commentId);

    const existingLike = await this.likeRepository.findByUserAndComment(
      userId,
      commentId,
    );

    if (existingLike) {
      throw new LikeAlreadyExistsException(
        'Usuario ja curtiu este comentario',
      );
    }

    const like = new Like({
      userId,
      postId: null,
      commentId,
    });

    await this.likeRepository.create(like);

    const createdLike = await this.likeRepository.findById(like.id);

    return new CreateLikeResponseDto(
      this.likeAdapter.convertToDto(createdLike),
      'Curtida registrada com sucesso',
      201,
    );
  }
}
