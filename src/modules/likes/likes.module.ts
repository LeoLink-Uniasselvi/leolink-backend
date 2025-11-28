import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '@/modules/likes/entities/like.entity';
import { LikesController } from '@/modules/likes/likes.controller';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import { LikeAdapter } from '@/modules/likes/like.adapter';
import { LikeTargetValidatorService } from '@/modules/likes/services/like-target-validator.service';
import {
  GetCommentLikesUseCase,
  GetPostLikesUseCase,
  GetUserLikesUseCase,
  HasUserLikedUseCase,
  LikeCommentUseCase,
  LikePostUseCase,
  UnlikeCommentUseCase,
  UnlikePostUseCase,
} from '@/modules/likes/use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [
    LikeRepository,
    {
      provide: 'ILikeRepository',
      useExisting: LikeRepository,
    },
    LikeAdapter,
    LikeTargetValidatorService,
    LikePostUseCase,
    UnlikePostUseCase,
    LikeCommentUseCase,
    UnlikeCommentUseCase,
    GetPostLikesUseCase,
    GetCommentLikesUseCase,
    GetUserLikesUseCase,
    HasUserLikedUseCase,
  ],
  exports: [LikeRepository],
})
export class LikesModule {}
