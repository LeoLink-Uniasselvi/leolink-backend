import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { CommentRepository } from './repositories/comment.repository';
import { CommentAdapter } from './comment.adapter';
import {
  CreateCommentUseCase,
  CreateReplyUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  GetPostCommentsUseCase,
  GetCommentRepliesUseCase,
  GetCommentUseCase,
  CountPostCommentsUseCase,
} from './use-cases';
import { CommentsController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentsController],
  providers: [
    CommentRepository,
    {
      provide: 'ICommentRepository',
      useExisting: CommentRepository,
    },
    CommentAdapter,
    CreateCommentUseCase,
    CreateReplyUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    GetPostCommentsUseCase,
    GetCommentRepliesUseCase,
    GetCommentUseCase,
    CountPostCommentsUseCase,
  ],
})
export class CommentsModule {}