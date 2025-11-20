import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AssignRoleToUserUseCase,
  CreateRoleUseCase,
  DeleteRoleUseCase,
  GetUserRolesUseCase,
  ListRolesUseCase,
  RemoveRoleFromUserUseCase,
  UpdateRoleUseCase,
} from './use-cases';
import {
  AssignRoleFormDto,
  AssignRoleResponseDto,
  CreateRoleFormDto,
  CreateRoleResponseDto,
  GetUserRolesResponseDto,
  IndexRolesResponseDto,
  RemoveRoleResponseDto,
  UpdateRoleFormDto,
  UpdateRoleResponseDto,
} from './dtos';
import { ErrorResponseDto, IdParamDto } from '@/common/dtos';
import { SuccessResponseDto } from '@/common/dtos/success-response.dto';

@ApiTags('Funcoes')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly assignRoleToUserUseCase: AssignRoleToUserUseCase,
    private readonly removeRoleFromUserUseCase: RemoveRoleFromUserUseCase,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar funcao',
    description: 'Cria uma nova funcao/papel no sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateRoleResponseDto,
    description: 'Funcao criada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada invalidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token invalido ou ausente',
    type: ErrorResponseDto,
  })
  create(@Body() body: CreateRoleFormDto) {
    return this.createRoleUseCase.execute(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar funcoes',
    description: 'Lista todas as funcoes ativas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IndexRolesResponseDto,
    description: 'Funcoes listadas com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token invalido ou ausente',
    type: ErrorResponseDto,
  })
  index() {
    return this.listRolesUseCase.execute();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar funcao',
    description: 'Atualiza o nome de uma funcao existente',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateRoleResponseDto,
    description: 'Funcao atualizada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Funcao nao encontrada',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada invalidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token invalido ou ausente',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Permissoes insuficientes',
    type: ErrorResponseDto,
  })
  update(@Param() params: IdParamDto, @Body() body: UpdateRoleFormDto) {
    return this.updateRoleUseCase.execute(params.id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover funcao',
    description:
      'Remove uma funcao. Caso esteja atribuida a algum usuario, o processo e bloqueado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Funcao removida com sucesso',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Funcao nao encontrada',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Formato de ID invalido',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token invalido ou ausente',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Permissoes insuficientes',
    type: ErrorResponseDto,
  })
  delete(@Param() params: IdParamDto) {
    return this.deleteRoleUseCase.execute(params.id);
  }

  @Post('assign')
  @ApiOperation({
    summary: 'Atribuir funcao a usuario',
    description: 'Adiciona uma funcao a um usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AssignRoleResponseDto,
    description: 'Funcao atribuida com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada invalidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token invalido ou ausente',
    type: ErrorResponseDto,
  })
  assign(@Body() body: AssignRoleFormDto) {
    return this.assignRoleToUserUseCase.execute(body);
  }

  @Delete('assign')
  @ApiOperation({
    summary: 'Remover funcao de usuario',
    description: 'Remove uma funcao especifica de um usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RemoveRoleResponseDto,
    description: 'Funcao removida com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada invalidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token invalido ou ausente',
    type: ErrorResponseDto,
  })
  remove(@Body() body: AssignRoleFormDto) {
    return this.removeRoleFromUserUseCase.execute(body.userId, body.roleId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Listar funcoes de um usuario',
    description: 'Obtendo todas as funcoes que um usuario possui',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserRolesResponseDto,
    description: 'Funcoes do usuario recuperadas com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuario nao encontrado',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token invalido ou ausente',
    type: ErrorResponseDto,
  })
  userRoles(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.getUserRolesUseCase.execute(userId);
  }
}
