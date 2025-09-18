import { Injectable } from '@nestjs/common';
import { User } from '@/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRepository } from '@/common/repositories/repository';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User>;
  findByIdWithDeleted(id: string): Promise<User>;
  findWithDeleted(): Promise<User[]>;
  activate(id: string): Promise<void>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private typeormRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<void> {
    await this.typeormRepository.save(user);
  }

  async update(user: User): Promise<void> {
    user.updatedAt = new Date();
    await this.typeormRepository.update(user.id, user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    user.deletedAt = new Date();
    await this.typeormRepository.update(id, user);
  }

  async activate(id: string): Promise<void> {
    const user = await this.findByIdWithDeleted(id);
    user.deletedAt = null;
    await this.typeormRepository.update(id, user);
  }

  async find(): Promise<User[]> {
    return await this.typeormRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findWithDeleted(): Promise<User[]> {
    return await this.typeormRepository.find({
      order: {
        id: 'ASC',
      },
      withDeleted: true,
    });
  }

  async findById(id: string): Promise<User> {
    return await this.typeormRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByIdWithDeleted(id: string): Promise<User> {
    return await this.typeormRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.typeormRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'name', 'email', 'password'],
    });
  }
}
