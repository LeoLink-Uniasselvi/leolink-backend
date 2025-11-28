import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostDto, CategoryDto } from './post.dtos';
import { PostCategory } from './entities/post-category.entity';

type PostAdapterOptions = {
  viewsCount?: number;
  commentsCount?: number;
};

@Injectable()
export class PostAdapter {
  convertToDto(post: Post, options: PostAdapterOptions = {}): PostDto {
    const dto = new PostDto();
    dto.id = post.id;
    dto.authorId = post.authorId;
    dto.content = post.content;
    dto.imageUrl = post.imageUrl ?? null;
    dto.isInstitutional = !!post.isInstitutional;
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;
    dto.deletedAt = post.deletedAt ?? null;
    dto.viewsCount = options.viewsCount ?? undefined;
    dto.commentsCount = options.commentsCount ?? undefined;

    if (Array.isArray(post.postCategories)) {
      dto.categories = post.postCategories
        .map((pc: PostCategory) => pc.category)
        .filter((category): category is NonNullable<typeof category> => !!category)
        .map((category) => {
          const categoryDto = new CategoryDto();
          categoryDto.id = category.id;
          categoryDto.name = category.name;
          categoryDto.createdAt = category.createdAt;
          categoryDto.updatedAt = category.updatedAt;
          return categoryDto;
        });
    }

    return dto;
  }

  convertMany(posts: Post[], options: PostAdapterOptions = {}): PostDto[] {
    return posts.map((post) => this.convertToDto(post, options));
  }
}
