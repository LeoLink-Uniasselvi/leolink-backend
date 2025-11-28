import { Injectable } from '@nestjs/common';
import { CommentDto } from './dtos';
import { Comment } from './entities/comment.entity';
import { CreateCommentFormDto, CreateReplyFormDto } from './dtos';

/**
 * Adapter responsible for transforming Comment entities into DTOs and
 * converting incoming DTOs into Comment entities. This helps to
 * decouple the domain model from the transport layer.
 */
@Injectable()
export class CommentAdapter {
  /**
   * Converts a Comment entity into its DTO representation. When
   * `includeReplies` is true nested replies will also be converted.
   */
  convertToDto(comment: Comment, includeReplies: boolean = false): CommentDto {
    if (!comment.author) {
      console.error('[CommentAdapter] ERRO: Comment sem author!', { commentId: comment.id, authorId: comment.authorId });
      throw new Error(`Comment ${comment.id} não tem author carregado`);
    }

    const dto = new CommentDto();
    dto.id = comment.id;
    dto.postId = comment.postId;
    dto.authorId = comment.authorId;
    dto.author = {
      id: comment.author.id,
      name: comment.author.name,
      email: comment.author.email,
    };
    dto.parentId = comment.parentId ?? null;
    dto.content = comment.content;
    dto.deletedAt = comment.deletedAt ?? null;
    dto.createdAt = comment.createdAt;
    dto.updatedAt = comment.updatedAt;

    // repliesCount counts the number of direct replies even if deleted
    if (Array.isArray(comment.replies)) {
      dto.repliesCount = comment.replies.filter((r) => true).length;
      if (includeReplies) {
        dto.replies = comment.replies.map((child) =>
          this.convertToDto(child, includeReplies),
        );
      }
    } else {
      dto.repliesCount = 0;
    }
    return dto;
  }

  /**
   * Creates a Comment entity from the provided form DTO for a new
   * root-level comment.
   */
  convertCreateCommentDtoToEntity(
    dto: CreateCommentFormDto,
    authorId: string,
  ): Comment {
    return new Comment({
      postId: dto.postId,
      authorId,
      content: dto.content,
      parentId: null,
    });
  }

  /**
   * Creates a Comment entity from the provided form DTO for a reply.
   */
  convertCreateReplyDtoToEntity(
    dto: CreateReplyFormDto,
    authorId: string,
  ): Comment {
    return new Comment({
      postId: dto.postId,
      parentId: dto.parentId,
      authorId,
      content: dto.content,
    });
  }
}