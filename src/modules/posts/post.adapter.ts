import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostDataDto } from './dtos/post-data.dto';

@Injectable()
export class PostAdapter {
  toDto(post: Post, userId?: string): PostDataDto {
    if (!post.author) {
      console.error('[PostAdapter] ERRO: Post sem author!', { postId: post.id, authorId: post.authorId });
      throw new Error(`Post ${post.id} não tem author carregado`);
    }
    
    const dto = new PostDataDto();
    dto.id = post.id;
    dto.content = post.content;
    dto.authorId = post.authorId;
    dto.author = {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
    };
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;
    dto.deletedAt = post.deletedAt;
    
    // TODO: Otimizar com query única usando JOIN/subquery
    // Por enquanto retorna 0 para não causar timeout
    dto.likesCount = 0;
    dto.commentsCount = 0;
    dto.isLiked = false;
    
    return dto;
  }

  toDtoArray(posts: Post[], userId?: string): PostDataDto[] {
    return posts.map((post) => this.toDto(post, userId));
  }
}
