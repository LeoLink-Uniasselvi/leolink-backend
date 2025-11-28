import { Inject, Injectable } from '@nestjs/common';
import { CommentRepository, type ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import { CommentAdapter } from '@/modules/comments/comment.adapter';
import { CommentDto } from '@/modules/comments/dtos';
import { BaseResponseDto } from '@/common/dtos';
import { CommentNotFoundException } from '@/modules/comments/exceptions';

@Injectable()
export class GetCommentUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly commentAdapter: CommentAdapter,
  ) {}

  async execute(commentId: string): Promise<BaseResponseDto<CommentDto>> {
    const comment = await this.commentRepository.findById(commentId, true);
    if (!comment) {
      throw new CommentNotFoundException();
    }
    const dto = this.commentAdapter.convertToDto(comment);
    return {
      data: dto,
      message: 'Comentário obtido com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}