import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CreateLikeResponseDto,
  RemoveLikeResponseDto,
  GetPostLikesResponseDto,
  GetCommentLikesResponseDto,
  GetUserLikesResponseDto,
  HasUserLikedQueryDto,
  HasUserLikedResponseDto,
  PostIdParamDto,
  CommentIdParamDto,
  UserIdParamDto,
} from '@/modules/likes/dtos';
import {
  LikePostUseCase,
  UnlikePostUseCase,
  LikeCommentUseCase,
  UnlikeCommentUseCase,
  GetPostLikesUseCase,
  GetCommentLikesUseCase,
  GetUserLikesUseCase,
  HasUserLikedUseCase,
} from '@/modules/likes/use-cases';
import { GetUser } from '@/modules/auth/decorators';
import type { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';
import { ErrorResponseDto } from '@/common/dtos';

@ApiTags('Curtidas')
@ApiBearerAuth('JWT-auth')
@Controller('likes')
export class LikesController {
  constructor(
    private readonly likePostUseCase: LikePostUseCase,
    private readonly unlikePostUseCase: UnlikePostUseCase,
    private readonly likeCommentUseCase: LikeCommentUseCase,
    private readonly unlikeCommentUseCase: UnlikeCommentUseCase,
    private readonly getPostLikesUseCase: GetPostLikesUseCase,
    private readonly getCommentLikesUseCase: GetCommentLikesUseCase,
    private readonly getUserLikesUseCase: GetUserLikesUseCase,
    private readonly hasUserLikedUseCase: HasUserLikedUseCase,
  ) {}

  @Post('posts/:postId')
  @ApiOperation({
    summary: 'Registrar curtida em post',
    description: 'Permite que o usuario autenticado curta um post',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateLikeResponseDto,
    description: 'Curtida registrada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados informados sao invalidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario nao autenticado',
    type: ErrorResponseDto,
  })
  async likePost(
    @Param() params: PostIdParamDto,
    @GetUser() user: JwtPayload,
  ): Promise<CreateLikeResponseDto> {
    return this.likePostUseCase.execute(user?.sub, params.postId);
  }

  @Delete('posts/:postId')
  @ApiOperation({
    summary: 'Remover curtida de post',
    description: 'Permite que o usuario autenticado remova a curtida de um post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RemoveLikeResponseDto,
    description: 'Curtida removida com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados informados sao invalidos',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Curtida nao encontrada',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario nao autenticado',
    type: ErrorResponseDto,
  })
  async unlikePost(
    @Param() params: PostIdParamDto,
    @GetUser() user: JwtPayload,
  ): Promise<RemoveLikeResponseDto> {
    return this.unlikePostUseCase.execute(user?.sub, params.postId);
  }

  @Post('comments/:commentId')
  @ApiOperation({
    summary: 'Registrar curtida em comentario',
    description: 'Permite que o usuario autenticado curta um comentario',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateLikeResponseDto,
    description: 'Curtida registrada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados informados sao invalidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario nao autenticado',
    type: ErrorResponseDto,
  })
  async likeComment(
    @Param() params: CommentIdParamDto,
    @GetUser() user: JwtPayload,
  ): Promise<CreateLikeResponseDto> {
    return this.likeCommentUseCase.execute(user?.sub, params.commentId);
  }

  @Delete('comments/:commentId')
  @ApiOperation({
    summary: 'Remover curtida de comentario',
    description:
      'Permite que o usuario autenticado remova a curtida de um comentario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RemoveLikeResponseDto,
    description: 'Curtida removida com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados informados sao invalidos',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Curtida nao encontrada',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario nao autenticado',
    type: ErrorResponseDto,
  })
  async unlikeComment(
    @Param() params: CommentIdParamDto,
    @GetUser() user: JwtPayload,
  ): Promise<RemoveLikeResponseDto> {
    return this.unlikeCommentUseCase.execute(user?.sub, params.commentId);
  }

  @Get('posts/:postId')
  @ApiOperation({
    summary: 'Listar curtidas de um post',
    description: 'Retorna a contagem e a lista de curtidas de um post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPostLikesResponseDto,
    description: 'Curtidas do post recuperadas com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados informados sao invalidos',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post nao encontrado',
    type: ErrorResponseDto,
  })
  async getPostLikes(
    @Param() params: PostIdParamDto,
  ): Promise<GetPostLikesResponseDto> {
    return this.getPostLikesUseCase.execute(params.postId);
  }

  @Get('comments/:commentId')
  @ApiOperation({
    summary: 'Listar curtidas de um comentario',
    description: 'Retorna a contagem e a lista de curtidas de um comentario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCommentLikesResponseDto,
    description: 'Curtidas do comentario recuperadas com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados informados sao invalidos',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Comentario nao encontrado',
    type: ErrorResponseDto,
  })
  async getCommentLikes(
    @Param() params: CommentIdParamDto,
  ): Promise<GetCommentLikesResponseDto> {
    return this.getCommentLikesUseCase.execute(params.commentId);
  }

  @Get('users/:userId')
  @ApiOperation({
    summary: 'Listar curtidas de um usuario',
    description: 'Retorna posts e comentarios curtidos por um usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserLikesResponseDto,
    description: 'Curtidas do usuario recuperadas com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados informados sao invalidos',
    type: ErrorResponseDto,
  })
  async getUserLikes(
    @Param() params: UserIdParamDto,
  ): Promise<GetUserLikesResponseDto> {
    return this.getUserLikesUseCase.execute(params.userId);
  }

  @Get('has-liked')
  @ApiOperation({
    summary: 'Verificar curtida do usuario autenticado',
    description:
      'Verifica se o usuario autenticado ja curtiu um post ou comentario especifico',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HasUserLikedResponseDto,
    description: 'Resultado da verificacao retornado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Parametros informados sao invalidos',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Conteudo alvo nao encontrado',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario nao autenticado',
    type: ErrorResponseDto,
  })
  async hasUserLiked(
    @Query() query: HasUserLikedQueryDto,
    @GetUser() user: JwtPayload,
  ): Promise<HasUserLikedResponseDto> {
    return this.hasUserLikedUseCase.execute(user?.sub, query.postId, query.commentId);
  }
}
