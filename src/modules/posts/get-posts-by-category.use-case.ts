import { Injectable } from '@nestjs/common';
import { ListPostsUseCase } from './list-posts.use-case';
import { ListPostsQueryDto, ListPostsResponseDto } from './post.dtos';

@Injectable()
export class GetPostsByCategoryUseCase {
  constructor(private readonly listPostsUseCase: ListPostsUseCase) {}

  async execute(
    categoryId: string,
    query: Omit<ListPostsQueryDto, 'categoryId'>,
  ): Promise<ListPostsResponseDto> {
    return this.listPostsUseCase.execute({
      ...query,
      categoryId,
    } as ListPostsQueryDto);
  }
}
