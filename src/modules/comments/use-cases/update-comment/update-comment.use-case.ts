import { Inject, Injectable } from '@nestjs/common';
import { CommentRepository, type ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import { CommentAdapter } from '@/modules/comments/comment.adapter';
import { UpdateCommentFormDto } from '@/modules/comments/dtos';
import { CommentDto } from '@/modules/comments/dtos';
import { BaseResponseDto } from '@/common/dtos';
import {
  CommentNotFoundException,
  UnauthorizedCommentActionException,
} from '@/modules/comments/exceptions';

/**
 * Use case responsible for updating the content of a comment. Only
 * the author of the comment is permitted to make changes.
 */
@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly commentAdapter: CommentAdapter,
  ) {}

  async execute(
    commentId: string,
    input: UpdateCommentFormDto,
    userId: string,
  ): Promise<BaseResponseDto<CommentDto>> {
    const comment = await this.commentRepository.findById(commentId, true);
    if (!comment) {
      throw new CommentNotFoundException();
    }
    // Only author can update; admin roles could be checked here when implemented
    if (comment.authorId !== userId) {
      throw new UnauthorizedCommentActionException();
    }
    // Apply changes
    comment.content = input.content;
    await this.commentRepository.update(comment);
    const dto = this.commentAdapter.convertToDto(comment);
    return {
      data: dto,
      message: 'Comentário atualizado com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}