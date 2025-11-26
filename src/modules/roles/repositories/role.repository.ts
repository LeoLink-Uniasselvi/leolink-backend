import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/modules/roles/entities/role.entity';
import { IRepository } from '@/common/repositories/repository';

export interface IRoleRepository extends IRepository<Role> {
  findByName(name: string, withDeleted?: boolean): Promise<Role | null>;
  findWithDeleted(): Promise<Role[]>;
  findByIdWithDeleted(id: string): Promise<Role>;
}

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly typeormRepository: Repository<Role>,
  ) {}

  async create(role: Role): Promise<void> {
    await this.typeormRepository.save(role);
  }

  async update(role: Role): Promise<void> {
    role.updatedAt = new Date();
    await this.typeormRepository.update(role.id, role);
  }

  async delete(id: string): Promise<void> {
    const role = await this.findById(id);
    if (!role) return;
    role.deletedAt = new Date();
    await this.typeormRepository.update(id, role);
  }

  async find(): Promise<Role[]> {
    return await this.typeormRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findWithDeleted(): Promise<Role[]> {
    return await this.typeormRepository.find({
      order: {
        name: 'ASC',
      },
      withDeleted: true,
    });
  }

  async findById(id: string): Promise<Role> {
    return await this.typeormRepository.findOne({
      where: { id },
    });
  }

  async findByIdWithDeleted(id: string): Promise<Role> {
    return await this.typeormRepository.findOne({
      where: { id },
      withDeleted: true,
    });
  }

  async findByName(name: string, withDeleted = false): Promise<Role | null> {
    const query = this.typeormRepository
      .createQueryBuilder('role')
      .where('LOWER(role.name) = LOWER(:name)', { name });

    if (!withDeleted) {
      query.andWhere('role.deletedAt IS NULL');
    }

    return await query.getOne();
  }
}
