import { Inject, Injectable } from '@nestjs/common';
import type { ICourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { Course } from '@/modules/courses/entities/course.entity';
import { CreateCourseFormDto, CreateCourseResponseDto } from '@/modules/courses/dtos';
import { BusinessRuleException } from '@/common/exceptions';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(input: CreateCourseFormDto): Promise<CreateCourseResponseDto> {
    const duplicated = await this.courseRepository.findByName(input.name);
    if (duplicated) throw new BusinessRuleException('Curso já existe');

    const course = new Course();
    course.name = input.name;
    course.startDate = new Date(input.startDate);
    await this.courseRepository.create(course);

    return {
      data: {
        id: course.id,
        name: course.name,
        startDate: course.startDate,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      },
      message: 'Curso criado com sucesso',
      statusCode: 201,
      timestamp: new Date().toISOString(),
    };
  }
}
