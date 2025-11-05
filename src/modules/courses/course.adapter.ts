import { Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CourseDto } from './dtos';

@Injectable()
export class CourseAdapter {
  convertToDto(course: Course): CourseDto {
    const dto = new CourseDto();
    dto.id = course.id;
    dto.name = course.name;
    dto.startDate = course.startDate;
    dto.createdAt = course.createdAt;
    dto.updatedAt = course.updatedAt;
    return dto;
  }
}

