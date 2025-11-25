import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { IRepository } from '@/common/repositories/repository';

/**
 * Interface defining the persistence operations supported by the
 * CommentRepository. It extends the generic IRepository to inherit
 * CRUD behaviours and adds comment specific queries.
 */
export interface ICommentRepository extends IRepository<Comment> {
  /**
   * Returns all comments for a given post ordered by creation date
   * ascending. Soft deleted comments are included only when
   * explicitly requested via `withDeleted`.
   */
  findByPostId(postId: string, withDeleted?: boolean): Promise<Comment[]>;

  /**
   * Returns all direct replies for a given parent comment. Soft
   * deleted comments are included only when explicitly requested via
   * `withDeleted`.
   */
  findByParentId(parentId: string, withDeleted?: boolean): Promise<Comment[]>;

  /**
   * Returns a single comment by its identifier. Soft deleted
   * comments can be fetched by passing `withDeleted` true.
   */
  findById(id: string, withDeleted?: boolean): Promise<Comment | null>;

  /**
   * Counts the number of comments belonging to a post. By default
   * soft deleted comments are excluded from the count.
   */
  countByPostId(postId: string, withDeleted?: boolean): Promise<number>;
}

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly typeormRepository: Repository<Comment>,
  ) {}

  async create(comment: Comment): Promise<void> {
    await this.typeormRepository.save(comment);
  }

  async update(comment: Comment): Promise<void> {
    comment.updatedAt = new Date();
    await this.typeormRepository.update(comment.id, comment);
  }

  async delete(id: string): Promise<void> {
    const comment = await this.findById(id, true);
    if (comment) {
      comment.deletedAt = new Date();
      await this.typeormRepository.update(id, comment);
    }
  }

  async find(): Promise<Comment[]> {
    return this.typeormRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string, withDeleted: boolean = false): Promise<Comment | null> {
    return await this.typeormRepository.findOne({
      where: { id },
      withDeleted,
    });
  }

  async findByPostId(postId: string, withDeleted: boolean = false): Promise<Comment[]> {
    return await this.typeormRepository.find({
      where: { postId },
      order: { createdAt: 'ASC' },
      withDeleted,
    });
  }

  async findByParentId(parentId: string, withDeleted: boolean = false): Promise<Comment[]> {
    return await this.typeormRepository.find({
      where: { parentId },
      order: { createdAt: 'ASC' },
      withDeleted,
    });
  }

  async countByPostId(postId: string, withDeleted: boolean = false): Promise<number> {
    return await this.typeormRepository.count({ where: { postId }, withDeleted });
  }
}