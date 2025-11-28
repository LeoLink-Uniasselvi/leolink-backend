import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IRepository } from '@/common/repositories/repository';
import { Post } from './entities/post.entity';
import { PostCategory } from './entities/post-category.entity';

export type FindPostsOptions = {
  page?: number;
  limit?: number;
  authorId?: string;
  categoryId?: string;
  isInstitutional?: boolean;
  search?: string;
  includeDeleted?: boolean;
};

export type FeedCursor = {
  createdAt: Date;
  id: string;
};

export interface IPostRepository extends IRepository<Post> {
  findById(id: string, withDeleted?: boolean): Promise<Post | null>;
  findPaginated(options: FindPostsOptions): Promise<[Post[], number]>;
  findByAuthor(
    authorId: string,
    options?: Omit<FindPostsOptions, 'authorId'>,
  ): Promise<[Post[], number]>;
  findByCategory(
    categoryId: string,
    options?: Omit<FindPostsOptions, 'categoryId'>,
  ): Promise<[Post[], number]>;
  findFeedForUser(
    userId: string,
    limit: number,
    cursor?: FeedCursor,
  ): Promise<Post[]>;
}

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly typeormRepository: Repository<Post>,
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(post: Post): Promise<void> {
    await this.typeormRepository.save(post);
  }

  async update(post: Post): Promise<void> {
    post.updatedAt = new Date();
    await this.typeormRepository.save(post);
  }

  async delete(id: string): Promise<void> {
    const post = await this.findById(id, true);
    if (post) {
      post.deletedAt = new Date();
      await this.typeormRepository.save(post);
    }
  }

  async find(): Promise<Post[]> {
    return await this.typeormRepository.find({
      where: { deletedAt: null },
      relations: ['postCategories', 'postCategories.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, withDeleted: boolean = false): Promise<Post | null> {
    return await this.typeormRepository.findOne({
      where: { id },
      withDeleted,
      relations: ['postCategories', 'postCategories.category'],
    });
  }

  private createBaseQuery(options: FindPostsOptions) {
    const qb = this.typeormRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.postCategories', 'postCategory')
      .leftJoinAndSelect('postCategory.category', 'category');

    if (!options.includeDeleted) {
      qb.andWhere('post.deletedAt IS NULL');
    }

    if (options.authorId) {
      qb.andWhere('post.authorId = :authorId', { authorId: options.authorId });
    }

    if (options.categoryId) {
      qb.andWhere('postCategory.categoryId = :categoryId', {
        categoryId: options.categoryId,
      });
    }

    if (options.isInstitutional !== undefined) {
      qb.andWhere('post.isInstitutional = :isInstitutional', {
        isInstitutional: options.isInstitutional,
      });
    }

    if (options.search) {
      qb.andWhere('LOWER(post.content) LIKE :search', {
        search: `%${options.search.toLowerCase()}%`,
      });
    }

    return qb;
  }

  async findPaginated(options: FindPostsOptions): Promise<[Post[], number]> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit =
      options.limit && options.limit > 0 && options.limit <= 100
        ? options.limit
        : 10;

    const qb = this.createBaseQuery(options)
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return await qb.getManyAndCount();
  }

  async findByAuthor(
    authorId: string,
    options: Omit<FindPostsOptions, 'authorId'> = {},
  ): Promise<[Post[], number]> {
    return this.findPaginated({ ...options, authorId });
  }

  async findByCategory(
    categoryId: string,
    options: Omit<FindPostsOptions, 'categoryId'> = {},
  ): Promise<[Post[], number]> {
    return this.findPaginated({ ...options, categoryId });
  }

  async findFeedForUser(
    userId: string,
    limit: number,
    cursor?: FeedCursor,
  ): Promise<Post[]> {
    const qb = this.createBaseQuery({ limit, page: 1 });

    qb.innerJoin(
      'follows',
      'follow',
      'follow.followee_id = post.author_id AND follow.follower_id = :userId',
      { userId },
    );

    if (cursor) {
      qb.andWhere(
        '(post.createdAt < :cursorCreatedAt OR (post.createdAt = :cursorCreatedAt AND post.id < :cursorId))',
        {
          cursorCreatedAt: cursor.createdAt,
          cursorId: cursor.id,
        },
      );
    }

    qb.orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .take(limit);

    return await qb.getMany();
  }
}
