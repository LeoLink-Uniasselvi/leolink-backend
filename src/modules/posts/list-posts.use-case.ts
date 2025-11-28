import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostAdapter } from './post.adapter';
import { ListPostsQueryDto, ListPostsResponseDto } from './post.dtos';
import { PaginationMetaDto } from '@/common/dtos/paginated.dtos';
import { PostViewRepository } from './post-view.repository';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
    private readonly postAdapter: PostAdapter,
    @Inject(PostViewRepository)
    private readonly postViewRepository: PostViewRepository,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

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

  async execute(query: ListPostsQueryDto): Promise<ListPostsResponseDto> {
    const [posts, total] = await this.postRepository.findPaginated({
      page: query.page,
      limit: query.limit,
      authorId: query.authorId,
      categoryId: query.categoryId,
      isInstitutional: query.isInstitutional,
      search: query.search,
    });

    const { viewCounts, commentCounts } = await this.hydrateCounts(
      posts.map((p) => p.id),
    );

    const postDtos = posts.map((post) =>
      this.postAdapter.convertToDto(post, {
        viewsCount: viewCounts.get(post.id),
        commentsCount: commentCounts.get(post.id),
      }),
    );

    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    const meta: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };

    const response = new ListPostsResponseDto(
      postDtos,
      meta,
      'Posts listados com sucesso',
      200,
    );

    return response;
  }
}
