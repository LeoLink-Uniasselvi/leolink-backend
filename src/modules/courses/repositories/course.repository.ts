import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '@/modules/courses/entities/course.entity';
import { IRepository } from '@/common/repositories/repository';

export interface ICourseRepository extends IRepository<Course> {
  findByName(name: string): Promise<Course | null>;
}

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly orm: Repository<Course>,
  ) {}

  async create(entity: Course): Promise<void> {
    await this.orm.save(entity);
  }

  async update(entity: Course): Promise<void> {
    entity.updatedAt = new Date();
    await this.orm.update(entity.id, entity);
  }

  async delete(id: string): Promise<void> {
    const c = await this.findById(id);
    c.deletedAt = new Date();
    await this.orm.update(id, c);
  }

  async find(): Promise<Course[]> {
    return this.orm.find({ order: { id: 'ASC' } });
  }

  async findById(id: string): Promise<Course> {
    return (await this.orm.findOne({ where: { id } })) as Course;
  }

  async findByName(name: string): Promise<Course | null> {
    return (await this.orm.findOne({ where: { name } })) ?? null;
  }
}

