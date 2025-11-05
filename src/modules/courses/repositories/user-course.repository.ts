import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCourse } from '@/modules/courses/entities/user-course.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Course } from '@/modules/courses/entities/course.entity';

@Injectable()
export class UserCourseRepository {
  constructor(
    @InjectRepository(UserCourse)
    private readonly orm: Repository<UserCourse>,
  ) {}

  async enroll(userId: string, courseId: string, startedAt: Date): Promise<UserCourse> {
    const entity = this.orm.create({ userId, courseId, startedAt });
    return await this.orm.save(entity);
  }

  async findByIds(userId: string, courseId: string): Promise<UserCourse | null> {
    return (await this.orm.findOne({ where: { userId, courseId } })) ?? null;
  }

  async existsByCourse(courseId: string): Promise<boolean> {
    const count = await this.orm.count({ where: { courseId } });
    return count > 0;
  }

  async deleteByIds(userId: string, courseId: string): Promise<void> {
    await this.orm.delete({ userId, courseId });
  }

  async listUsersByCourse(courseId: string): Promise<User[]> {
    const rows = await this.orm
      .createQueryBuilder('uc')
      .leftJoinAndSelect('uc.user', 'user')
      .where('uc.courseId = :courseId', { courseId })
      .orderBy('user.name', 'ASC')
      .getMany();
    return rows.map((r) => r.user).filter((u): u is User => !!u);
  }

  async listCoursesByUser(userId: string): Promise<Course[]> {
    const rows = await this.orm
      .createQueryBuilder('uc')
      .leftJoinAndSelect('uc.course', 'course')
      .where('uc.userId = :userId', { userId })
      .orderBy('course.name', 'ASC')
      .getMany();
    return rows.map((r) => r.course).filter((c): c is Course => !!c);
  }
}
