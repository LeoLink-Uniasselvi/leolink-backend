import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostCategory } from './entities/post-category.entity';

export interface IPostCategoryRepository {
  findByPostId(postId: string): Promise<PostCategory[]>;
  addCategories(postId: string, categoryIds: string[]): Promise<void>;
  removeCategories(postId: string, categoryIds: string[]): Promise<void>;
  replaceCategories(postId: string, categoryIds: string[]): Promise<void>;
}

@Injectable()
export class PostCategoryRepository implements IPostCategoryRepository {
  constructor(
    @InjectRepository(PostCategory)
    private readonly typeormRepository: Repository<PostCategory>,
  ) {}

  async findByPostId(postId: string): Promise<PostCategory[]> {
    return this.typeormRepository.find({
      where: { postId },
      relations: ['category'],
      order: { createdAt: 'ASC' },
    });
  }

  async addCategories(postId: string, categoryIds: string[]): Promise<void> {
    if (!categoryIds?.length) return;

    const values = categoryIds.map(
      (categoryId) => new PostCategory({ postId, categoryId }),
    );

    await this.typeormRepository
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();
  }

  async removeCategories(postId: string, categoryIds: string[]): Promise<void> {
    if (!categoryIds?.length) return;
    await this.typeormRepository.delete({
      postId,
      categoryId: In(categoryIds),
    });
  }

  async replaceCategories(postId: string, categoryIds: string[]): Promise<void> {
    await this.typeormRepository.delete({ postId });
    await this.addCategories(postId, categoryIds);
  }
}
