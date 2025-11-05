import { Inject, Injectable } from '@nestjs/common';
import type { ICourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseAdapter } from '@/modules/courses/course.adapter';
import { GetCourseResponseDto } from '@/modules/courses/dtos';
import { ResourceNotFoundException } from '@/common/exceptions';

@Injectable()
export class GetCourseUseCase {
  constructor(
    @Inject(CourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly courseAdapter: CourseAdapter,
  ) {}

  async execute(id: string): Promise<GetCourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new ResourceNotFoundException('Curso');
    return {
      data: this.courseAdapter.convertToDto(course),
      message: 'Curso recuperado com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
