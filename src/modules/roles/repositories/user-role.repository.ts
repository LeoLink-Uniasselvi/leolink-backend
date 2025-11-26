import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRepository } from '@/common/repositories/repository';
import { UserRole } from '@/modules/roles/entities/user-role.entity';
import { Role } from '@/modules/roles/entities/role.entity';

export interface IUserRoleRepository extends IRepository<UserRole> {
  findByUser(userId: string): Promise<UserRole[]>;
  findByUserAndRole(
    userId: string,
    roleId: string,
  ): Promise<UserRole | null>;
  findRolesByUser(userId: string): Promise<Role[]>;
  countByRole(roleId: string): Promise<number>;
  deleteByUserAndRole(userId: string, roleId: string): Promise<void>;
}

@Injectable()
export class UserRoleRepository implements IUserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly typeormRepository: Repository<UserRole>,
  ) {}

  async create(userRole: UserRole): Promise<void> {
    await this.typeormRepository.save(userRole);
  }

  async update(userRole: UserRole): Promise<void> {
    await this.typeormRepository.update(userRole.id, userRole);
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepository.delete(id);
  }

  async deleteByUserAndRole(userId: string, roleId: string): Promise<void> {
    await this.typeormRepository.delete({ userId, roleId });
  }

  async find(): Promise<UserRole[]> {
    return await this.typeormRepository.find({
      relations: ['role'],
    });
  }

  async findById(id: string): Promise<UserRole> {
    return await this.typeormRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findByUser(userId: string): Promise<UserRole[]> {
    return await this.typeormRepository.find({
      where: { userId },
      relations: ['role'],
    });
  }

  async findByUserAndRole(
    userId: string,
    roleId: string,
  ): Promise<UserRole | null> {
    return await this.typeormRepository.findOne({
      where: { userId, roleId },
      relations: ['role'],
    });
  }

  async findRolesByUser(userId: string): Promise<Role[]> {
    const userRoles = await this.typeormRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.userId = :userId', { userId })
      .andWhere('role.deletedAt IS NULL')
      .getMany();

    return userRoles
      .map((userRole) => userRole.role)
      .filter((role): role is Role => Boolean(role));
  }

  async countByRole(roleId: string): Promise<number> {
    return await this.typeormRepository.count({
      where: { roleId },
    });
  }
}
