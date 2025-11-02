import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  FollowUserUseCase,
  UnfollowUserUseCase,
  GetFollowersUseCase,
  GetFollowingUseCase,
  GetFollowersCountUseCase,
  GetFollowingCountUseCase,
  IsFollowingUseCase,
} from './use-cases';
import {
  FollowUserFormDto,
  FollowUserResponseDto,
  UnfollowUserResponseDto,
  GetFollowersResponseDto,
  GetFollowingResponseDto,
  GetFollowersQueryDto,
  GetFollowingQueryDto,
} from './dtos';

@ApiTags('follows')
@ApiBearerAuth()
@Controller('users/:userId/follows')
export class FollowsController {
  constructor(
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly getFollowersUseCase: GetFollowersUseCase,
    private readonly getFollowingUseCase: GetFollowingUseCase,
    private readonly getFollowersCountUseCase: GetFollowersCountUseCase,
    private readonly getFollowingCountUseCase: GetFollowingCountUseCase,
    private readonly isFollowingUseCase: IsFollowingUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Seguir um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário logado' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário seguido com sucesso',
    type: FollowUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou regras de negócio violadas',
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  async followUser(
    @Param('userId') followerId: string,
    @Body() followUserDto: FollowUserFormDto,
    // @Req() req: any, // Para quando implementar autenticação
  ): Promise<FollowUserResponseDto> {
    return this.followUserUseCase.execute(followerId, followUserDto.followeeId);
  }

  @Delete(':followeeId')
  @ApiOperation({ summary: 'Deixar de seguir um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário logado' })
  @ApiParam({ name: 'followeeId', description: 'ID do usuário a ser deixado de seguir' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deixou de seguir o usuário com sucesso',
    type: UnfollowUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou usuário não está sendo seguido',
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  async unfollowUser(
    @Param('userId') followerId: string,
    @Param('followeeId') followeeId: string,
  ): Promise<UnfollowUserResponseDto> {
    return this.unfollowUserUseCase.execute(followerId, followeeId);
  }

  @Get('followers')
  @ApiOperation({ summary: 'Listar seguidores de um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de seguidores retornada com sucesso',
    type: GetFollowersResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async getFollowers(
    @Param('userId') userId: string,
    @Query() query: GetFollowersQueryDto,
  ): Promise<GetFollowersResponseDto> {
    return this.getFollowersUseCase.execute(userId, query);
  }

  @Get('following')
  @ApiOperation({ summary: 'Listar usuários que o usuário está seguindo' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários seguindo retornada com sucesso',
    type: GetFollowingResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async getFollowing(
    @Param('userId') userId: string,
    @Query() query: GetFollowingQueryDto,
  ): Promise<GetFollowingResponseDto> {
    return this.getFollowingUseCase.execute(userId, query);
  }

  @Get('followers/count')
  @ApiOperation({ summary: 'Contar seguidores de um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contagem de seguidores retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 150 }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async getFollowersCount(
    @Param('userId') userId: string,
  ): Promise<{ count: number }> {
    return this.getFollowersCountUseCase.execute(userId);
  }

  @Get('following/count')
  @ApiOperation({ summary: 'Contar usuários que o usuário está seguindo' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contagem de seguindo retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 85 }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async getFollowingCount(
    @Param('userId') userId: string,
  ): Promise<{ count: number }> {
    return this.getFollowingCountUseCase.execute(userId);
  }

  @Get('is-following/:followeeId')
  @ApiOperation({ summary: 'Verificar se usuário A segue usuário B' })
  @ApiParam({ name: 'userId', description: 'ID do usuário seguidor' })
  @ApiParam({ name: 'followeeId', description: 'ID do usuário que pode estar sendo seguido' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status de follow retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        isFollowing: { type: 'boolean', example: true }
      }
    }
  })
  async isFollowing(
    @Param('userId') followerId: string,
    @Param('followeeId') followeeId: string,
  ): Promise<{ isFollowing: boolean }> {
    return this.isFollowingUseCase.execute(followerId, followeeId);
  }
}