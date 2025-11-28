import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentRepository, type ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import { Post } from '@/modules/posts/entities/post.entity';
import { BaseResponseDto } from '@/common/dtos';
import { CountPostCommentsResponseDto } from '@/modules/comments/dtos';
import { PostNotFoundException } from '@/modules/comments/exceptions';

@Injectable()
export class CountPostCommentsUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(postId: string): Promise<CountPostCommentsResponseDto> {
    const postExists = await this.postRepository.findOne({ where: { id: postId } });
    if (!postExists) {
      throw new PostNotFoundException();
    }
    const count = await this.commentRepository.countByPostId(postId);
    return {
      data: { count },
      message: 'Contagem de comentários obtida com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}