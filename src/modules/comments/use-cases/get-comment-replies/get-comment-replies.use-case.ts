import { Inject, Injectable } from '@nestjs/common';
import { CommentRepository } from '@/modules/comments/repositories/comment.repository';
import type { ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import { CommentAdapter } from '@/modules/comments/comment.adapter';
import { CommentDto } from '@/modules/comments/dtos';
import { BaseResponseDto } from '@/common/dtos';
import { CommentNotFoundException } from '@/modules/comments/exceptions';
import { Comment } from '@/modules/comments/entities/comment.entity';

/**
 * Use case for retrieving replies of a specific comment. Nested replies
 * are included to provide the full thread beneath the selected
 * comment.
 */
@Injectable()
export class GetCommentRepliesUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly commentAdapter: CommentAdapter,
  ) {}

  async execute(commentId: string): Promise<BaseResponseDto<CommentDto[]>> {
    const parent = await this.commentRepository.findById(commentId, true);
    if (!parent) {
      throw new CommentNotFoundException();
    }
    // Recursively gather replies
    const gatherReplies = async (comment: Comment): Promise<Comment[]> => {
      const replies = await this.commentRepository.findByParentId(
        comment.id,
        true,
      );
      for (const reply of replies) {
        const nested = await gatherReplies(reply);
        reply.replies = nested;
      }
      return replies;
    };
    const replies = await gatherReplies(parent);
    const dtoList = replies.map((c) => this.commentAdapter.convertToDto(c, true));
    return {
      data: dtoList,
      message: 'Respostas obtidas com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
