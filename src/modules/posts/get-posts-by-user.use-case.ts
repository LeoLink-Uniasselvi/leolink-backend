import { Injectable } from '@nestjs/common';
import { ListPostsUseCase } from './list-posts.use-case';
import { ListPostsQueryDto, ListPostsResponseDto } from './post.dtos';

@Injectable()
export class GetPostsByUserUseCase {
  constructor(private readonly listPostsUseCase: ListPostsUseCase) {}

  async execute(
    userId: string,
    query: Omit<ListPostsQueryDto, 'authorId'>,
  ): Promise<ListPostsResponseDto> {
    return this.listPostsUseCase.execute({
      ...query,
      authorId: userId,
    } as ListPostsQueryDto);
  }
}
