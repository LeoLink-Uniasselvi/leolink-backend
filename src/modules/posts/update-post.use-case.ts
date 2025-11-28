import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostCategoryRepository } from './post-category.repository';
import type { IPostCategoryRepository } from './post-category.repository';
import { PostAdapter } from './post.adapter';
import { UpdatePostFormDto, UpdatePostResponseDto } from './post.dtos';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';
import {
  CategoryNotFoundException,
  PostAccessDeniedException,
  PostNotFoundException,
} from './posts.exceptions';
import { UserRole } from '@/modules/roles/entities/user-role.entity';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
    @Inject(PostCategoryRepository)
    private readonly postCategoryRepository: IPostCategoryRepository,
    private readonly postAdapter: PostAdapter,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
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

  private async isAdmin(userId: string): Promise<boolean> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });
    return userRoles.some(
      (ur) => ur.role && ur.role.name.toLowerCase() === 'admin',
    );
  }

  private async ensureAuthorization(post: Post, userId: string) {
    const isOwner = post.authorId === userId;
    const isAdmin = await this.isAdmin(userId);
    if (!isOwner && !isAdmin) {
      throw new PostAccessDeniedException();
    }
  }

  async execute(
    postId: string,
    input: UpdatePostFormDto,
    userId: string,
  ): Promise<UpdatePostResponseDto> {
    const post = await this.postRepository.findById(postId, true);
    if (!post || post.deletedAt) {
      throw new PostNotFoundException();
    }

    await this.ensureAuthorization(post, userId);
    await this.validateCategories(input.categoryIds);

    if (input.content !== undefined) {
      post.content = input.content.trim();
    }
    if (input.imageUrl !== undefined) {
      post.imageUrl = input.imageUrl;
    }
    if (input.isInstitutional !== undefined) {
      post.isInstitutional = input.isInstitutional;
    }

    await this.postRepository.update(post);

    if (input.categoryIds) {
      await this.postCategoryRepository.replaceCategories(
        post.id,
        input.categoryIds,
      );
    }

    const updated = await this.postRepository.findById(post.id, true);
    const dto = updated
      ? this.postAdapter.convertToDto(updated)
      : this.postAdapter.convertToDto(post);

    return {
      data: dto,
      message: 'Post atualizado com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
