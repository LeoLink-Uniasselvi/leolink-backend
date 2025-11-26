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
export class LikePostUseCase {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: ILikeRepository,
    private readonly likeAdapter: LikeAdapter,
    private readonly likeTargetValidator: LikeTargetValidatorService,
  ) {}

  async execute(userId: string, postId?: string): Promise<CreateLikeResponseDto> {
    if (!postId) {
      throw new InvalidLikeTargetException('Informe o postId para registrar a curtida');
    }

    await this.likeTargetValidator.ensurePostExists(postId);

    const existingLike = await this.likeRepository.findByUserAndPost(userId, postId);
    if (existingLike) {
      throw new LikeAlreadyExistsException(
        'Usuario ja curtiu este post',
      );
    }

    const like = new Like({
      userId,
      postId,
      commentId: null,
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
