import { Injectable } from '@nestjs/common';
import { UserCourseRepository } from '@/modules/courses/repositories/user-course.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { EnrollUserFormDto, EnrollUserResponseDto } from '@/modules/courses/dtos';
import { BusinessRuleException, ResourceNotFoundException, ValidationException } from '@/common/exceptions';

@Injectable()
export class EnrollUserUseCase {
  constructor(
    private readonly userCourseRepository: UserCourseRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(courseId: string, input: EnrollUserFormDto): Promise<EnrollUserResponseDto> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new ResourceNotFoundException('Curso');

    const exists = await this.userCourseRepository.findByIds(input.userId, courseId);
    if (exists) throw new BusinessRuleException('Usuário já matriculado neste curso');

    const startedAt = new Date(input.startedAt);
    if (startedAt < new Date(course.startDate)) {
      throw new ValidationException('startedAt não pode ser anterior à data de início do curso');
    }

    const enrollment = await this.userCourseRepository.enroll(input.userId, courseId, startedAt);
    return {
      data: { userId: enrollment.userId, courseId: enrollment.courseId, startedAt: enrollment.startedAt },
      message: 'Usuário matriculado com sucesso',
      statusCode: 201,
      timestamp: new Date().toISOString(),
    };
  }
}
