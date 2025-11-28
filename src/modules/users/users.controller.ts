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
  ApiConflictResponse,
} from '@nestjs/swagger';
import {
  CreateUserUseCase,
  IndexUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  SoftDeleteUserUseCase,
  ActivateUserUseCase,
  FollowUserUseCase,
  UnfollowUserUseCase,
  GetFollowersUseCase,
  GetFollowingUseCase,
  GetFollowStatsUseCase,
} from './use-cases';
import {
  CreateUserFormDto,
  UpdateUserFormDto,
  GetUserResponseDto,
  IndexUsersResponseDto,
  CreateUserResponseDto,
  UpdateUserResponseDto,
  DeleteUserResponseDto,
  ActivateUserResponseDto,
  IndexUsersQueryDto,
} from './dtos';
import { ErrorResponseDto, IdParamDto } from '@/common/dtos';
import { GetUser } from '@/modules/auth/decorators';
import { User } from './entities/user.entity';

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
    private followUserUseCase: FollowUserUseCase,
    private unfollowUserUseCase: UnfollowUserUseCase,
    private getFollowersUseCase: GetFollowersUseCase,
    private getFollowingUseCase: GetFollowingUseCase,
    private getFollowStatsUseCase: GetFollowStatsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Cria uma nova conta de usuário',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserResponseDto,
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
    type: IndexUsersResponseDto,
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
    type: GetUserResponseDto,
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
    type: UpdateUserResponseDto,
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

  // ==================== FOLLOW ENDPOINTS ====================

  @Post(':id/follow')
  @ApiOperation({
    summary: 'Seguir usuário',
    description: 'Começa a seguir um usuário',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário seguido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Já está seguindo este usuário',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Não pode seguir a si mesmo',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  follow(@Param() params: IdParamDto, @GetUser() user: User) {
    return this.followUserUseCase.execute(user.id, params.id);
  }

  @Delete(':id/follow')
  @ApiOperation({
    summary: 'Deixar de seguir usuário',
    description: 'Para de seguir um usuário',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deixou de seguir com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Não está seguindo este usuário',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  unfollow(@Param() params: IdParamDto, @GetUser() user: User) {
    return this.unfollowUserUseCase.execute(user.id, params.id);
  }

  @Get(':id/followers')
  @ApiOperation({
    summary: 'Listar seguidores',
    description: 'Obtém lista paginada de seguidores de um usuário',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Seguidores obtidos com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  getFollowers(
    @Param() params: IdParamDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.getFollowersUseCase.execute(params.id, +page, +limit);
  }

  @Get(':id/following')
  @ApiOperation({
    summary: 'Listar seguindo',
    description: 'Obtém lista paginada de usuários que este usuário segue',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de seguindo obtida com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  getFollowing(
    @Param() params: IdParamDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.getFollowingUseCase.execute(params.id, +page, +limit);
  }

  @Get(':id/follow-stats')
  @ApiOperation({
    summary: 'Estatísticas de follow',
    description: 'Obtém contagem de seguidores e seguindo de um usuário',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estatísticas obtidas com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  getFollowStats(@Param() params: IdParamDto, @GetUser() user: User) {
    return this.getFollowStatsUseCase.execute(params.id, user?.id);
  }
}
