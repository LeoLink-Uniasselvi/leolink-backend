import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';
import { CourseDto } from '@/modules/courses/dtos';

export class GetUserCoursesResponseDto extends BaseResponseDto<CourseDto[]> {
  @ApiProperty({ type: [CourseDto] })
  declare data: CourseDto[];
}

