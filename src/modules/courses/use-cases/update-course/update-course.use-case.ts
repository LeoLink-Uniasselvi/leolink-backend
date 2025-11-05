import { Inject, Injectable } from '@nestjs/common';
import type { ICourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseAdapter } from '@/modules/courses/course.adapter';
import { UpdateCourseFormDto, UpdateCourseResponseDto } from '@/modules/courses/dtos';
import { BusinessRuleException, ResourceNotFoundException } from '@/common/exceptions';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(CourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly courseAdapter: CourseAdapter,
  ) {}

  async execute(id: string, input: UpdateCourseFormDto): Promise<UpdateCourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new ResourceNotFoundException('Curso');

    if (input.name) {
      const dup = await this.courseRepository.findByName(input.name);
      if (dup && dup.id !== id) {
        throw new BusinessRuleException('Curso já existe');
      }
    }

    if (typeof input.name === 'string') course.name = input.name;
    if (typeof input.startDate === 'string') course.startDate = new Date(input.startDate);

    await this.courseRepository.update(course);

    return {
      data: this.courseAdapter.convertToDto(course),
      message: 'Curso atualizado com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
