import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostCategory } from './entities/post-category.entity';
import { PostView } from './entities/post-view.entity';
import { Category } from './entities/category.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { User } from '@/modules/users/entities/user.entity';
import { UserRole } from '@/modules/roles/entities/user-role.entity';
import { PostRepository } from './post.repository';
import { PostCategoryRepository } from './post-category.repository';
import { PostViewRepository } from './post-view.repository';
import { PostAdapter } from './post.adapter';
import { CreatePostUseCase } from './create-post.use-case';
import { UpdatePostUseCase } from './update-post.use-case';
import { DeletePostUseCase } from './delete-post.use-case';
import { GetPostUseCase } from './get-post.use-case';
import { ListPostsUseCase } from './list-posts.use-case';
import { GetPostsByUserUseCase } from './get-posts-by-user.use-case';
import { GetPostsByCategoryUseCase } from './get-posts-by-category.use-case';
import { GetFeedPostsUseCase } from './get-feed-posts.use-case';
import { AddCategoriesToPostUseCase } from './add-categories-to-post.use-case';
import { RemoveCategoriesFromPostUseCase } from './remove-categories-from-post.use-case';
import { TrackPostViewUseCase } from './track-post-view.use-case';
import { GetPostViewsUseCase } from './get-post-views.use-case';
import { PostsController } from './posts.controller';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Role } from '@/modules/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostCategory,
      PostView,
      Category,
      Comment,
      User,
      UserRole,
      Role,
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostRepository,
    PostCategoryRepository,
    PostViewRepository,
    PostAdapter,
    UserRepository,
    {
      provide: 'IPostRepository',
      useExisting: PostRepository,
    },
    {
      provide: 'IPostCategoryRepository',
      useExisting: PostCategoryRepository,
    },
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetPostUseCase,
    ListPostsUseCase,
    GetPostsByUserUseCase,
    GetPostsByCategoryUseCase,
    GetFeedPostsUseCase,
    AddCategoriesToPostUseCase,
    RemoveCategoriesFromPostUseCase,
    TrackPostViewUseCase,
    GetPostViewsUseCase,
  ],
  exports: [PostRepository, PostCategoryRepository, PostViewRepository],
})
export class PostsModule {}
