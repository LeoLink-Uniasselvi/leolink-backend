import { Inject, Injectable } from '@nestjs/common';
import type { ICourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { CourseAdapter } from '@/modules/courses/course.adapter';
import { IndexCoursesQueryDto } from '@/modules/courses/dtos';
import { BaseResponseDto } from '@/common/dtos';
import { CourseDto } from '@/modules/courses/dtos';

@Injectable()
export class IndexCoursesUseCase {
  constructor(
    @Inject(CourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly courseAdapter: CourseAdapter,
  ) {}

  async execute(
    query: IndexCoursesQueryDto,
  ): Promise<
    BaseResponseDto<{
      items: CourseDto[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }>
  > {
    const all = await this.courseRepository.find();

    let filtered = all;
    if (query.search) {
      const term = query.search.toLowerCase();
      filtered = all.filter((c) => c.name.toLowerCase().includes(term));
    }

    if (query.startDateFrom) {
      const from = new Date(query.startDateFrom);
      filtered = filtered.filter((c) => new Date(c.startDate) >= from);
    }
    if (query.startDateTo) {
      const to = new Date(query.startDateTo);
      filtered = filtered.filter((c) => new Date(c.startDate) <= to);
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const paged = filtered.slice(skip, skip + limit);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return new BaseResponseDto(
      {
        items: paged.map((c) => this.courseAdapter.convertToDto(c)),
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
      'Cursos listados com sucesso',
      200,
    );
  }
}
