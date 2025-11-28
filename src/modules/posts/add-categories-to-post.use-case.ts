import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostCategoryRepository } from './post-category.repository';
import type { IPostCategoryRepository } from './post-category.repository';
import { ManageCategoriesDto, ManageCategoriesResponseDto } from './post.dtos';
import {
  PostNotFoundException,
  CategoryNotFoundException,
  PostAccessDeniedException,
} from './posts.exceptions';
import { PostAdapter } from './post.adapter';
import { Category } from './entities/category.entity';
import { UserRole } from '@/modules/roles/entities/user-role.entity';

@Injectable()
export class AddCategoriesToPostUseCase {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
    @Inject(PostCategoryRepository)
    private readonly postCategoryRepository: IPostCategoryRepository,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly postAdapter: PostAdapter,
  ) {}

  private async validateCategories(categoryIds: string[]) {
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

  private async isAdmin(userId: string): Promise<boolean> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });
    return userRoles.some(
      (ur) => ur.role && ur.role.name.toLowerCase() === 'admin',
    );
  }

  private async ensureAuthorization(postAuthorId: string, userId: string) {
    const isOwner = postAuthorId === userId;
    const isAdmin = await this.isAdmin(userId);
    if (!isOwner && !isAdmin) {
      throw new PostAccessDeniedException();
    }
  }

  async execute(
    postId: string,
    input: ManageCategoriesDto,
    userId: string,
  ): Promise<ManageCategoriesResponseDto> {
    const post = await this.postRepository.findById(postId);
    if (!post || post.deletedAt) {
      throw new PostNotFoundException();
    }

    await this.ensureAuthorization(post.authorId, userId);
    await this.validateCategories(input.categoryIds);
    await this.postCategoryRepository.addCategories(postId, input.categoryIds);

    const updated = await this.postRepository.findById(postId);
    const dto = updated
      ? this.postAdapter.convertToDto(updated)
      : this.postAdapter.convertToDto(post);

    return {
      data: dto,
      message: 'Categorias adicionadas com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
