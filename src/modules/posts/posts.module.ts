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
import { LikesModule } from '@/modules/likes/likes.module';
import { CommentsModule } from '@/modules/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => UsersModule),
    forwardRef(() => LikesModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [PostsController],
  providers: [
    PostRepository,
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
