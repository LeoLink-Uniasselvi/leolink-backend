import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
  CreateUserUseCase,
  IndexUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  SoftDeleteUserUseCase,
  ActivateUserUseCase,
} from './use-cases';
import {
  CreateUserFormDto,
  UpdateUserFormDto,
  UserResponseDto,
  PaginatedUsersResponseDto,
  CreateUserRespDto,
  UpdateUserRespDto,
  DeleteUserResponseDto,
  ActivateUserResponseDto,
} from './dtos';
import { IndexUsersQueryDto } from './dtos/index-users/index-users.query.dto';
import { ErrorResponseDto, IdParamDto } from '@/common/dtos';

@ApiTags('Usuários')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private indexUsersUseCase: IndexUsersUseCase,
    private getUserUseCase: GetUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private softDeleteUserUseCase: SoftDeleteUserUseCase,
    private activateUserUseCase: ActivateUserUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Cria uma nova conta de usuário',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserRespDto,
    description: 'Usuário criado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos ou email já existe',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  create(@Body() createUserDto: CreateUserFormDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Obtém lista paginada de usuários com busca opcional',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (mínimo: 1, padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (mínimo: 1, máximo: 100, padrão: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termo de busca para filtrar por nome ou email',
    example: 'ana',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuários recuperados com sucesso',
    type: PaginatedUsersResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de paginação inválidos',
    type: ErrorResponseDto,
    schema: {
      example: {
        message: ['Page must be at least 1', 'Limit cannot exceed 100'],
        error: 'Requisição Inválida',
        statusCode: 400,
        timestamp: '2025-09-22T10:30:00Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  index(@Query() query: IndexUsersQueryDto) {
    return this.indexUsersUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter usuário por ID',
    description: 'Obtém um usuário específico pelo seu ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário recuperado com sucesso',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    type: ErrorResponseDto,
    schema: {
      example: {
        message: 'Usuário não encontrado',
        error: 'Não Encontrado',
        statusCode: 404,
        timestamp: '2025-09-22T10:30:00Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Formato de ID de usuário inválido',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  get(@Param() params: IdParamDto) {
    return this.getUserUseCase.execute(params.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza informações do usuário por ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateUserRespDto,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos ou formato de ID inválido',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Permissões insuficientes',
    type: ErrorResponseDto,
  })
  update(
    @Param() params: IdParamDto,
    @Body() updateUserDto: UpdateUserFormDto,
  ) {
    return this.updateUserUseCase.execute(params.id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir usuário (soft delete)',
    description: 'Exclui um usuário por ID (marca como inativo)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteUserResponseDto,
    description: 'Usuário excluído com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Formato de ID de usuário inválido',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Permissões insuficientes',
    type: ErrorResponseDto,
  })
  softDelete(@Param() params: IdParamDto) {
    return this.softDeleteUserUseCase.execute(params.id);
  }

  @Post(':id/activate')
  @ApiOperation({
    summary: 'Ativar usuário',
    description: 'Ativa um usuário previamente desativado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ActivateUserResponseDto,
    description: 'Usuário ativado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Formato de ID inválido ou usuário já está ativo',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Permissões insuficientes',
    type: ErrorResponseDto,
  })
  activate(@Param() params: IdParamDto) {
    return this.activateUserUseCase.execute(params.id);
  }
}
