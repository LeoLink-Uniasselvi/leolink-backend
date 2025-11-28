import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostCategoryRepository } from './post-category.repository';
import type { IPostCategoryRepository } from './post-category.repository';
import { PostAdapter } from './post.adapter';
import {
  CreatePostFormDto,
  CreatePostResponseDto,
} from './post.dtos';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserNotFoundException } from '@/modules/users/exceptions';
import {
  CategoryNotFoundException,
  InvalidPostPayloadException,
} from './posts.exceptions';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
    @Inject(PostCategoryRepository)
    private readonly postCategoryRepository: IPostCategoryRepository,
    private readonly postAdapter: PostAdapter,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private async validateCategories(categoryIds?: string[]) {
    if (!categoryIds || categoryIds.length === 0) return;
    const found = await this.categoryRepository.find({
      where: { id: In(categoryIds) },
    });
    const missing = categoryIds.filter(
      (id) => !found.find((item) => item.id === id),
    );
    if (missing.length) {
      throw new CategoryNotFoundException(
        `Categorias nao encontradas: ${missing.join(', ')}`,
      );
    }
  }

  async execute(
    input: CreatePostFormDto,
    authorId: string,
  ): Promise<CreatePostResponseDto> {
    const author = await this.userRepository.findById(authorId);
    if (!author || author.deletedAt) {
      throw new UserNotFoundException();
    }

    if (!input.content?.trim()) {
      throw new InvalidPostPayloadException('Conteudo obrigatorio');
    }

    await this.validateCategories(input.categoryIds);

    const post = new Post({
      authorId,
      content: input.content.trim(),
      imageUrl: input.imageUrl ?? null,
      isInstitutional: Boolean(input.isInstitutional),
    });
    await this.postRepository.create(post);

    if (input.categoryIds?.length) {
      await this.postCategoryRepository.addCategories(post.id, input.categoryIds);
    }

    const postWithRelations = await this.postRepository.findById(post.id);
    const dto = postWithRelations
      ? this.postAdapter.convertToDto(postWithRelations, { viewsCount: 0 })
      : this.postAdapter.convertToDto(post, { viewsCount: 0 });

    return {
      data: dto,
      message: 'Post criado com sucesso',
      statusCode: 201,
      timestamp: new Date().toISOString(),
    };
  }
}
