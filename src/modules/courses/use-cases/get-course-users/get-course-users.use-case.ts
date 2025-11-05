import { Injectable } from '@nestjs/common';
import { UserCourseRepository } from '@/modules/courses/repositories/user-course.repository';
import { GetCourseUsersResponseDto } from '@/modules/courses/dtos';
import { ResourceNotFoundException } from '@/common/exceptions';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { UserDto } from '@/modules/users/dtos';

@Injectable()
export class GetCourseUsersUseCase {
  constructor(
    private readonly userCourseRepository: UserCourseRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(courseId: string): Promise<GetCourseUsersResponseDto> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new ResourceNotFoundException('Curso');

    const users = await this.userCourseRepository.listUsersByCourse(courseId);
    const data: UserDto[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.deletedAt ? false : true,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    return {
      data,
      message: 'Alunos do curso obtidos com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}

