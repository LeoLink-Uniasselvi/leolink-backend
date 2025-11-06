import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeTargetNotFoundException } from '@/modules/likes/exceptions';

@Injectable()
export class LikeTargetValidatorService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async ensurePostExists(postId: string): Promise<void> {
    const exists = await this.existsInTable('posts', postId);
    if (!exists) {
      throw new LikeTargetNotFoundException('Post nao encontrado');
    }
  }

  async ensureCommentExists(commentId: string): Promise<void> {
    const exists = await this.existsInTable('comments', commentId);
    if (!exists) {
      throw new LikeTargetNotFoundException('Comentario nao encontrado');
    }
  }

  private async existsInTable(table: string, id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `SELECT 1 FROM "${table}" WHERE id = $1 LIMIT 1`,
      [id],
    );
    return result.length > 0;
  }
}
