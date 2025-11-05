import { Injectable } from '@nestjs/common';
import { UserCourseRepository } from '@/modules/courses/repositories/user-course.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { SuccessResponseDto } from '@/common/dtos';
import { ResourceNotFoundException } from '@/common/exceptions';

@Injectable()
export class DeleteEnrollmentUseCase {
  constructor(
    private readonly userCourseRepository: UserCourseRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(courseId: string, userId: string): Promise<SuccessResponseDto> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new ResourceNotFoundException('Curso');

    const existing = await this.userCourseRepository.findByIds(userId, courseId);
    if (!existing) throw new ResourceNotFoundException('Matrícula');

    await this.userCourseRepository.deleteByIds(userId, courseId);
    return {
      data: null,
      message: 'Matrícula removida com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}

