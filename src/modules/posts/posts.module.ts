import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { PostRepository } from './repositories/post.repository';
import {
  CreatePostUseCase,
  GetPostUseCase,
  IndexPostsUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  GetUserPostsUseCase,
  GetFeedUseCase,
} from './use-cases';
import { PostAdapter } from './post.adapter';
import { UsersModule } from '@/modules/users/users.module';
import { Like } from '@/modules/likes/entities/like.entity';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { CommentRepository } from '@/modules/comments/repositories/comment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, Comment]),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostsController],
  providers: [
    PostRepository,
    LikeRepository,
    CommentRepository,
    CreatePostUseCase,
    GetPostUseCase,
    IndexPostsUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetUserPostsUseCase,
    GetFeedUseCase,
    PostAdapter,
  ],
  exports: [PostRepository],
})
export class PostsModule {}
