import { Injectable } from '@nestjs/common';
import { UserCourseRepository } from '@/modules/courses/repositories/user-course.repository';
import { GetUserCoursesResponseDto, CourseDto } from '@/modules/courses/dtos';
import { CourseAdapter } from '@/modules/courses/course.adapter';

@Injectable()
export class GetUserCoursesUseCase {
  constructor(
    private readonly userCourseRepository: UserCourseRepository,
    private readonly courseAdapter: CourseAdapter,
  ) {}

  async execute(userId: string): Promise<GetUserCoursesResponseDto> {
    const courses = await this.userCourseRepository.listCoursesByUser(userId);
    const data: CourseDto[] = courses.map((c) => this.courseAdapter.convertToDto(c));
    return {
      data,
      message: 'Cursos do usuário obtidos com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}

