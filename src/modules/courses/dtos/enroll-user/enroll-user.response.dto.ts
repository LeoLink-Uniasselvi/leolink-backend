import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/dtos';

export class EnrollUserResponseDto extends BaseResponseDto<{
  userId: string;
  courseId: string;
  startedAt: Date;
}> {
  @ApiProperty({
    example: { userId: '...', courseId: '...', startedAt: '2025-02-01' },
  })
  declare data: { userId: string; courseId: string; startedAt: Date };
}

