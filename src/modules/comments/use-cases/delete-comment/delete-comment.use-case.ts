import { Inject, Injectable } from '@nestjs/common';
import { CommentRepository, type ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import {
  CommentNotFoundException,
  UnauthorizedCommentActionException,
} from '@/modules/comments/exceptions';
import { DeleteCommentResponseDto } from '@/modules/comments/dtos';

/**
 * Use case responsible for soft deleting a comment. Only the author
 * (or an admin when roles are implemented) may delete their comment.
 */
@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(commentId: string, userId: string): Promise<DeleteCommentResponseDto> {
    const comment = await this.commentRepository.findById(commentId, true);
    if (!comment) {
      throw new CommentNotFoundException();
    }
    if (comment.authorId !== userId) {
      throw new UnauthorizedCommentActionException();
    }
    await this.commentRepository.delete(commentId);
    return {
      data: null,
      message: 'Comentário removido com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}