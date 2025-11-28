import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { CommentRepository, type ICommentRepository } from '@/modules/comments/repositories/comment.repository';
import { CommentAdapter } from '@/modules/comments/comment.adapter';
import { Post } from '@/modules/posts/entities/post.entity';
import { BaseResponseDto } from '@/common/dtos';
import { CommentDto } from '@/modules/comments/dtos';
import { PostNotFoundException } from '@/modules/comments/exceptions';

/**
 * Use case responsible for retrieving all comments of a post in a
 * hierarchical structure. Deleted comments are included to preserve
 * conversation context.
 */
@Injectable()
export class GetPostCommentsUseCase {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly commentAdapter: CommentAdapter,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(postId: string): Promise<BaseResponseDto<CommentDto[]>> {
    const postExists = await this.postRepository.findOne({ where: { id: postId } });
    if (!postExists) {
      throw new PostNotFoundException();
    }
    // Fetch all comments including soft deleted to preserve context
    const comments = await this.commentRepository.findByPostId(postId, true);
    // Build a map of parentId to its children
    // Use a Map to allow null as a key safely
    const childrenMap: Map<string | null, Comment[]> = new Map();
    for (const comment of comments) {
      const parentKey = comment.parentId ?? null;
      const existing = childrenMap.get(parentKey) || [];
      existing.push(comment);
      childrenMap.set(parentKey, existing);
    }
    // Recursively assign replies to build the tree
    const assignReplies = (comment: Comment) => {
      const children = childrenMap.get(comment.id) || [];
      comment.replies = children;
      for (const child of children) {
        assignReplies(child);
      }
    };
    // Identify root-level comments
    const rootComments = childrenMap.get(null) || [];
    for (const root of rootComments) {
      assignReplies(root);
    }
    const dtoList = rootComments.map((comment) =>
      this.commentAdapter.convertToDto(comment, true),
    );
    return {
      data: dtoList,
      message: 'Comentários obtidos com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}