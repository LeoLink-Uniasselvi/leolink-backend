import { Inject, Injectable } from '@nestjs/common';
import type { ICourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { SuccessResponseDto } from '@/common/dtos';
import { BusinessRuleException, ResourceNotFoundException } from '@/common/exceptions';
import { UserCourseRepository } from '@/modules/courses/repositories/user-course.repository';

@Injectable()
export class SoftDeleteCourseUseCase {
  constructor(
    @Inject(CourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly userCourseRepository: UserCourseRepository,
  ) {}

  async execute(id: string): Promise<SuccessResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new ResourceNotFoundException('Curso');

    const hasEnrollment = await this.userCourseRepository.existsByCourse(id);
    if (hasEnrollment) throw new BusinessRuleException('Curso possui matrículas e não pode ser removido');

    await this.courseRepository.delete(id);
    return {
      data: null,
      message: 'Curso excluído com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
