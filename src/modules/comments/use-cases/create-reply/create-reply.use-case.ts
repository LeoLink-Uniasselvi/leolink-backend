import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository, type ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import { CommentAdapter } from '@/modules/comments/comment.adapter';
import { CreateReplyFormDto } from '@/modules/comments/dtos';
import { CommentDto } from '@/modules/comments/dtos';
import { BaseResponseDto } from '@/common/dtos';
import { Post } from '@/modules/posts/entities/post.entity';
import {
  PostNotFoundException,
  ParentCommentNotFoundException,
  InvalidParentCommentException,
} from '@/modules/comments/exceptions';

// Maximum allowed depth for replies. For example a depth of 3 means
// root comment -> reply -> reply -> reply is not allowed. Adjust as
// necessary to enforce discussion structure.
const MAX_REPLY_DEPTH = 3;

@Injectable()
export class CreateReplyUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly commentAdapter: CommentAdapter,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(
    input: CreateReplyFormDto,
    authorId: string,
  ): Promise<BaseResponseDto<CommentDto>> {
    // Validate parent comment exists
    const parent = await this.commentRepository.findById(
      input.parentId,
      true,
    );
    if (!parent) {
      throw new ParentCommentNotFoundException();
    }
    // Derive the postId from parent comment when not provided or verify match
    const actualPostId = parent.postId;
    if (input.postId && input.postId !== actualPostId) {
      throw new InvalidParentCommentException(
        'O comentário pai pertence a outro post',
      );
    }
    input.postId = actualPostId;
    // Validate post exists
    const postExists = await this.postRepository.findOne({
      where: { id: input.postId },
    });
    if (!postExists) {
      throw new PostNotFoundException();
    }
    // Validate depth
    let depth = 1;
    let currentParentId: string | null | undefined = parent.parentId;
    while (currentParentId) {
      depth++;
      if (depth >= MAX_REPLY_DEPTH) {
        throw new InvalidParentCommentException(
          `Limite de profundidade de ${MAX_REPLY_DEPTH} excedido`,
        );
      }
      const currentParent = await this.commentRepository.findById(
        currentParentId,
        true,
      );
      currentParentId = currentParent?.parentId;
    }
    // Create entity
    const comment = this.commentAdapter.convertCreateReplyDtoToEntity(
      input,
      authorId,
    );
    await this.commentRepository.create(comment);

    // Buscar o comentário com o author carregado
    const savedComment = await this.commentRepository.findById(comment.id);
    if (!savedComment) {
      throw new Error('Erro ao recuperar resposta criada');
    }

    const dto = this.commentAdapter.convertToDto(savedComment);
    return {
      data: dto,
      message: 'Resposta criada com sucesso',
      statusCode: 201,
      timestamp: new Date().toISOString(),
    };
  }
}