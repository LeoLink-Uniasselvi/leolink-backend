import { Injectable, Inject } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostDataDto } from './dtos/post-data.dto';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import { CommentRepository } from '@/modules/comments/repositories/comment.repository';

@Injectable()
export class PostAdapter {
  constructor(
    @Inject(LikeRepository)
    private readonly likeRepository: LikeRepository,
    @Inject(CommentRepository)
    private readonly commentRepository: CommentRepository,
  ) {}

  async toDto(post: Post, userId?: string): Promise<PostDataDto> {
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
    
    // Buscar contagem de likes e comentários
    const [likesCount, commentsCount] = await Promise.all([
      this.likeRepository.countByTargetId(post.id),
      this.commentRepository.countByPostId(post.id),
    ]);
    
    dto.likesCount = likesCount;
    dto.commentsCount = commentsCount;
    
    // Verificar se o usuário atual curtiu o post
    if (userId) {
      dto.isLiked = await this.likeRepository.hasUserLiked(userId, post.id);
    } else {
      dto.isLiked = false;
    }
    
    return dto;
  }

  async toDtoArray(posts: Post[], userId?: string): Promise<PostDataDto[]> {
    return Promise.all(posts.map((post) => this.toDto(post, userId)));
  }
}
