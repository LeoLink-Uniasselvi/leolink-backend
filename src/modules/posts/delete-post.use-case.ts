import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import type { IPostRepository } from './post.repository';
import { PostAdapter } from './post.adapter';
import { DeletePostResponseDto } from './post.dtos';
import { PostNotFoundException, PostAccessDeniedException } from './posts.exceptions';
import { UserRole } from '@/modules/roles/entities/user-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: IPostRepository,
    private readonly postAdapter: PostAdapter,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  private async isAdmin(userId: string): Promise<boolean> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });
    return userRoles.some(
      (ur) => ur.role && ur.role.name.toLowerCase() === 'admin',
    );
  }

  private async ensureAuthorization(authorId: string, userId: string) {
    const isOwner = authorId === userId;
    const isAdmin = await this.isAdmin(userId);
    if (!isOwner && !isAdmin) {
      throw new PostAccessDeniedException();
    }
  }

  async execute(postId: string, userId: string): Promise<DeletePostResponseDto> {
    const post = await this.postRepository.findById(postId, true);
    if (!post || post.deletedAt) {
      throw new PostNotFoundException();
    }

    await this.ensureAuthorization(post.authorId, userId);
    await this.postRepository.delete(postId);

    const dto = this.postAdapter.convertToDto(post);

    return {
      data: dto,
      message: 'Post removido com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
