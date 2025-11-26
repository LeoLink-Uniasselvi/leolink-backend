import { Injectable } from '@nestjs/common';
import { Like } from '@/modules/likes/entities/like.entity';
import { LikeDto, LikeTargetType } from '@/modules/likes/dtos';

@Injectable()
export class LikeAdapter {
  convertToDto(like: Like): LikeDto {
    const targetType: LikeTargetType = like.postId ? 'post' : 'comment';

    return {
      id: like.id,
      userId: like.userId,
      postId: like.postId ?? null,
      commentId: like.commentId ?? null,
      targetType,
      createdAt: like.createdAt,
      updatedAt: like.updatedAt,
    };
  }

  convertToDtoList(likes: Like[]): LikeDto[] {
    return likes.map((like) => this.convertToDto(like));
  }
}
