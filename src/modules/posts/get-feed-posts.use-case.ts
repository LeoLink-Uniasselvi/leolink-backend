import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import type { IPostRepository, FeedCursor } from './post.repository';
import { PostAdapter } from './post.adapter';
import { FeedPostsQueryDto, FeedResponseDto, FeedMetaDto } from './post.dtos';
import { PostViewRepository } from './post-view.repository';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetFeedPostsUseCase {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
    private readonly postAdapter: PostAdapter,
    @Inject(PostViewRepository)
    private readonly postViewRepository: PostViewRepository,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private parseCursor(cursor?: string): FeedCursor | undefined {
    if (!cursor) return undefined;
    const [iso, id] = cursor.split(':');
    if (!iso || !id) return undefined;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return undefined;
    return { createdAt: date, id };
  }

  private buildNextCursor(posts: { createdAt: Date; id: string }[]): string | null {
    if (!posts.length) return null;
    const last = posts[posts.length - 1];
    return `${last.createdAt.toISOString()}:${last.id}`;
  }

  private async hydrateCounts(postIds: string[]) {
    const viewCounts = new Map<string, number>();
    const commentCounts = new Map<string, number>();

    for (const postId of postIds) {
      const views = await this.postViewRepository.countByPost(postId);
      viewCounts.set(postId, views);
      const comments = await this.commentRepository.count({
        where: { postId, deletedAt: null },
      });
      commentCounts.set(postId, comments);
    }

    return { viewCounts, commentCounts };
  }

  async execute(
    userId: string,
    query: FeedPostsQueryDto,
  ): Promise<FeedResponseDto> {
    const limit =
      query.limit && query.limit > 0 && query.limit <= 50 ? query.limit : 10;
    const cursor = this.parseCursor(query.cursor);

    const posts = await this.postRepository.findFeedForUser(userId, limit, cursor);

    const { viewCounts, commentCounts } = await this.hydrateCounts(
      posts.map((p) => p.id),
    );

    const postDtos = posts.map((post) =>
      this.postAdapter.convertToDto(post, {
        viewsCount: viewCounts.get(post.id),
        commentsCount: commentCounts.get(post.id),
      }),
    );

    const meta: FeedMetaDto = {
      nextCursor: this.buildNextCursor(posts),
      limit,
    };

    return {
      data: { items: postDtos, meta },
      message: 'Feed carregado com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
