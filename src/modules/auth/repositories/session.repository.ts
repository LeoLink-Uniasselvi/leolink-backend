import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '@/modules/auth/entities/session.entity';
import { IRepository } from '@/common/repositories/repository';

export interface ISessionRepository extends IRepository<Session> {
  findByUser(id: string): Promise<Session[]>;
  findByToken(token: string): Promise<Session | null>;
}

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(Session)
    private typeormRepository: Repository<Session>,
  ) {}

  async create(session: Session): Promise<void> {
    await this.typeormRepository.save(session);
  }

  async update(session: Session): Promise<void> {
    await this.typeormRepository.update(session.id, session);
  }

  async delete(id: string): Promise<void> {
    const session = await this.findById(id);
    session.revokedAt = new Date();

    await this.typeormRepository.update(session.id, session);
  }

  async activate(id: string): Promise<void> {
    const session = await this.findByIdWithDeleted(id);
    session.revokedAt = null;

    await this.typeormRepository.update(session.id, session);
  }

  async find(): Promise<Session[]> {
    return await this.typeormRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findWithDeleted(): Promise<Session[]> {
    return await this.typeormRepository.find({
      withDeleted: true,
    });
  }

  async findByUser(id: string): Promise<Session[]> {
    return await this.typeormRepository.find({
      where: {
        userId: id,
      },
    });
  }

  async findByToken(token: string): Promise<Session | null> {
    return await this.typeormRepository.findOne({
      where: {
        token: token,
      },
    });
  }

  async findById(id: string): Promise<Session> {
    return await this.typeormRepository.findOne({ where: { id: id } });
  }

  async findByIdWithDeleted(id: string): Promise<Session> {
    return await this.typeormRepository.findOne({
      where: {
        id: id,
      },
      withDeleted: true,
    });
  }
}
