import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository, type ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import { CommentAdapter } from '@/modules/comments/comment.adapter';
import { CreateCommentFormDto } from '@/modules/comments/dtos';
import { CommentDto } from '@/modules/comments/dtos';
import { BaseResponseDto } from '@/common/dtos';
import { Post } from '@/modules/posts/entities/post.entity';
import {
  PostNotFoundException,
} from '@/modules/comments/exceptions';

/**
 * Use case for creating a root-level comment in a post. It validates that
 * the referenced post exists before persisting the comment.
 */
@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly commentAdapter: CommentAdapter,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(
    input: CreateCommentFormDto,
    authorId: string,
  ): Promise<BaseResponseDto<CommentDto>> {
    // Verify that the post exists
    const postExists = await this.postRepository.findOne({
      where: { id: input.postId },
    });
    if (!postExists) {
      throw new PostNotFoundException();
    }
    // Create entity
    const comment = this.commentAdapter.convertCreateCommentDtoToEntity(
      input,
      authorId,
    );
    await this.commentRepository.create(comment);

    const dto = this.commentAdapter.convertToDto(comment);
    return {
      data: dto,
      message: 'Comentário criado com sucesso',
      statusCode: 201,
      timestamp: new Date().toISOString(),
    };
  }
}