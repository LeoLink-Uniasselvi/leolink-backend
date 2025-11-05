import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserCourse } from './entities/user-course.entity';
import { CoursesController } from './courses.controller';
import { CourseRepository } from './repositories/course.repository';
import { UserCourseRepository } from './repositories/user-course.repository';
import { CourseAdapter } from './course.adapter';
import {
  CreateCourseUseCase,
  UpdateCourseUseCase,
  GetCourseUseCase,
  IndexCoursesUseCase,
  SoftDeleteCourseUseCase,
  EnrollUserUseCase, DeleteEnrollmentUseCase, GetCourseUsersUseCase, GetUserCoursesUseCase,
} from './use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([Course, UserCourse])],
  controllers: [CoursesController],
  providers: [
    CourseRepository,
    { provide: 'ICourseRepository', useExisting: CourseRepository },
    UserCourseRepository,
    CourseAdapter,
    CreateCourseUseCase,
    UpdateCourseUseCase,
    GetCourseUseCase,
    IndexCoursesUseCase,
    SoftDeleteCourseUseCase,
    EnrollUserUseCase, DeleteEnrollmentUseCase, GetCourseUsersUseCase, GetUserCoursesUseCase,
  ],
})
export class CoursesModule {}


