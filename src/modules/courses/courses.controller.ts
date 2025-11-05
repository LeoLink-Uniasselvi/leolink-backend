import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateCourseUseCase,
  UpdateCourseUseCase,
  GetCourseUseCase,
  IndexCoursesUseCase,
  SoftDeleteCourseUseCase,
  EnrollUserUseCase,
  DeleteEnrollmentUseCase,
  GetCourseUsersUseCase,
  GetUserCoursesUseCase,
} from './use-cases';
import {
  CreateCourseFormDto,
  CreateCourseResponseDto,
  UpdateCourseFormDto,
  UpdateCourseResponseDto,
  GetCourseResponseDto,
  IndexCoursesQueryDto,
  DeleteCourseResponseDto,
  EnrollUserFormDto,
  EnrollUserResponseDto,
  GetCourseUsersResponseDto,
  GetUserCoursesResponseDto,
} from './dtos';
import { ErrorResponseDto, IdParamDto } from '@/common/dtos';
import { Public } from '@/modules/auth/decorators/public.decorator';

@ApiTags('Cursos')
@ApiBearerAuth('JWT-auth')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
    private readonly indexCoursesUseCase: IndexCoursesUseCase,
    private readonly softDeleteCourseUseCase: SoftDeleteCourseUseCase,
    private readonly enrollUserUseCase: EnrollUserUseCase,
    private readonly deleteEnrollmentUseCase: DeleteEnrollmentUseCase,
    private readonly getCourseUsersUseCase: GetCourseUsersUseCase,
    private readonly getUserCoursesUseCase: GetUserCoursesUseCase,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar curso' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateCourseResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  create(@Body() dto: CreateCourseFormDto) {
    return this.createCourseUseCase.execute(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar cursos' })
  @ApiResponse({ status: HttpStatus.OK })
  index(@Query() query: IndexCoursesQueryDto) {
    return this.indexCoursesUseCase.execute(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Detalhar curso' })
  @ApiResponse({ status: HttpStatus.OK, type: GetCourseResponseDto })
  get(@Param() params: IdParamDto) {
    return this.getCourseUseCase.execute(params.id);
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar curso' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateCourseResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateCourseFormDto) {
    return this.updateCourseUseCase.execute(params.id, dto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover curso (soft delete)' })
  @ApiResponse({ status: HttpStatus.OK, type: DeleteCourseResponseDto })
  remove(@Param() params: IdParamDto) {
    return this.softDeleteCourseUseCase.execute(params.id);
  }

  @Public()
  @Post(':id/enroll')
  @ApiOperation({ summary: 'Matricular usuário no curso' })
  @ApiResponse({ status: HttpStatus.CREATED, type: EnrollUserResponseDto })
  enroll(@Param() params: IdParamDto, @Body() dto: EnrollUserFormDto) {
    return this.enrollUserUseCase.execute(params.id, dto);
  }

  @Public()
  @Delete(':courseId/enrollments/:userId')
  @ApiOperation({ summary: 'Remover matrícula do usuário no curso' })
  @ApiResponse({ status: HttpStatus.OK })
  unenroll(@Param('courseId') courseId: string, @Param('userId') userId: string) {
    return this.deleteEnrollmentUseCase.execute(courseId, userId);
  }

  @Public()
  @Get(':courseId/users')
  @ApiOperation({ summary: 'Listar alunos de um curso' })
  @ApiResponse({ status: HttpStatus.OK, type: GetCourseUsersResponseDto })
  getCourseUsers(@Param('courseId') courseId: string) {
    return this.getCourseUsersUseCase.execute(courseId);
  }

  @Public()
  @Get('users/:userId/courses')
  @ApiOperation({ summary: 'Listar cursos de um usuário' })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserCoursesResponseDto })
  getUserCourses(@Param('userId') userId: string) {
    return this.getUserCoursesUseCase.execute(userId);
  }
}
