import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostDataDto } from './dtos/post-data.dto';
import { LikeRepository } from '@/modules/likes/repositories/like.repository';
import { CommentRepository } from '@/modules/comments/repositories/comment.repository';

@Injectable()
export class PostAdapter {
  constructor(
    private readonly likeRepository: LikeRepository,
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
    
    // Carregar curtidas e comentários
    dto.likesCount = await this.likeRepository.countByPost(post.id);
    dto.commentsCount = await this.commentRepository.countByPostId(post.id);
    
    // Verificar se usuário curtiu (se userId fornecido)
    if (userId) {
      const like = await this.likeRepository.findByUserAndPost(userId, post.id);
      dto.isLiked = !!like;
    } else {
      dto.isLiked = false;
    }
    
    return dto;
  }

  async toDtoArray(posts: Post[], userId?: string): Promise<PostDataDto[]> {
    return Promise.all(posts.map((post) => this.toDto(post, userId)));
  }
}
