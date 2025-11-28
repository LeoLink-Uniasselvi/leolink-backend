import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IRepository } from '@/common/repositories/repository';
import { Post } from '../entities/post.entity';

export interface IPostRepository extends IRepository<Post> {
  findByAuthorId(authorId: string): Promise<Post[]>;
  findAllWithAuthor(page: number, limit: number, search?: string): Promise<[Post[], number]>;
  findByIdWithAuthor(id: string): Promise<Post | null>;
  findByAuthorIdPaginated(authorId: string, page: number, limit: number): Promise<[Post[], number]>;
  findByAuthorIds(authorIds: string[], page: number, limit: number): Promise<[Post[], number]>;
}

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectRepository(Post)
    private typeormRepository: Repository<Post>,
  ) {}

  async create(post: Post): Promise<void> {
    const savedPost = await this.typeormRepository.save(post);
    // Garantir que o ID foi atribuído
    post.id = savedPost.id;
    post.createdAt = savedPost.createdAt;
    post.updatedAt = savedPost.updatedAt;
  }

  async update(post: Post): Promise<void> {
    post.updatedAt = new Date();
    await this.typeormRepository.update(post.id, post);
  }

  async delete(id: string): Promise<void> {
    const post = await this.findById(id);
    post.deletedAt = new Date();
    await this.typeormRepository.update(id, post);
  }

  async find(): Promise<Post[]> {
    return await this.typeormRepository.find({
      where: { deletedAt: null },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Post> {
    return await this.typeormRepository.findOneOrFail({
      where: { id, deletedAt: null },
      relations: ['author'],
    });
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return this.typeormRepository.find({
      where: { authorId, deletedAt: null },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithAuthor(page: number = 1, limit: number = 10, search?: string): Promise<[Post[], number]> {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.typeormRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.deletedAt IS NULL')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.andWhere('post.content ILIKE :search', { search: `%${search}%` });
    }

    return queryBuilder.getManyAndCount();
  }

  async findByIdWithAuthor(id: string): Promise<Post | null> {
    return this.typeormRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['author'],
    });
  }

  async findByAuthorIdPaginated(authorId: string, page: number = 1, limit: number = 10): Promise<[Post[], number]> {
    const skip = (page - 1) * limit;
    
    return this.typeormRepository.findAndCount({
      where: { authorId, deletedAt: null },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async findByAuthorIds(authorIds: string[], page: number = 1, limit: number = 10): Promise<[Post[], number]> {
    if (authorIds.length === 0) {
      return [[], 0];
    }

    const skip = (page - 1) * limit;
    
    return this.typeormRepository.findAndCount({
      where: { authorId: In(authorIds), deletedAt: null },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }
}
