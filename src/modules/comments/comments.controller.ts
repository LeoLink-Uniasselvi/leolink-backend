import {
  Controller,
  Post as HttpPost,
  Patch as HttpPatch,
  Delete as HttpDelete,
  Get as HttpGet,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateCommentUseCase,
  CreateReplyUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  GetPostCommentsUseCase,
  GetCommentRepliesUseCase,
  GetCommentUseCase,
  CountPostCommentsUseCase,
} from './use-cases';
import {
  CreateCommentFormDto,
  CreateCommentResponseDto,
  CreateReplyFormDto,
  CreateReplyResponseDto,
  UpdateCommentFormDto,
  UpdateCommentResponseDto,
  DeleteCommentResponseDto,
  GetPostCommentsResponseDto,
  GetCommentRepliesResponseDto,
  GetCommentResponseDto,
  CountPostCommentsResponseDto,
  PostIdParamDto,
  CommentIdParamDto,
} from './dtos';
import { ErrorResponseDto } from '@/common/dtos';
import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import type { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Comentários')
@ApiBearerAuth('JWT-auth')
@Controller()
export class CommentsController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly createReplyUseCase: CreateReplyUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly getPostCommentsUseCase: GetPostCommentsUseCase,
    private readonly getCommentRepliesUseCase: GetCommentRepliesUseCase,
    private readonly getCommentUseCase: GetCommentUseCase,
    private readonly countPostCommentsUseCase: CountPostCommentsUseCase,
  ) {}

  @HttpPost('posts/:postId/comments')
  @ApiOperation({
    summary: 'Criar comentário em um post',
    description: 'Cria um novo comentário raiz para um post',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateCommentResponseDto,
    description: 'Comentário criado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado',
    type: ErrorResponseDto,
  })
  createComment(
    @Param() params: PostIdParamDto,
    @Body() body: Pick<CreateCommentFormDto, 'content'>,
    @GetUser() user: JwtPayload,
  ) {
    const dto = new CreateCommentFormDto();
    dto.postId = params.postId;
    dto.content = body.content;
    return this.createCommentUseCase.execute(dto, user.sub);
  }

  @HttpPost('comments/:commentId/replies')
  @ApiOperation({
    summary: 'Criar resposta a um comentário',
    description: 'Cria uma nova resposta a um comentário existente',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateReplyResponseDto,
    description: 'Resposta criada com sucesso',
  })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Comentário ou post não encontrado', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Regra de negócio violada', type: ErrorResponseDto })
  createReply(
    @Param() params: CommentIdParamDto,
    @Body() body: Pick<CreateReplyFormDto, 'content'>,
    @GetUser() user: JwtPayload,
  ) {
    const dto = new CreateReplyFormDto();
    // parentId comes from route param
    dto.parentId = params.commentId;
    dto.content = body.content;
    // postId will be inferred inside the use-case if omitted
    return this.createReplyUseCase.execute(dto, user.sub);
  }

  @HttpPatch('comments/:commentId')
  @ApiOperation({
    summary: 'Atualizar comentário',
    description: 'Atualiza o conteúdo de um comentário existente',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateCommentResponseDto })
  @ApiNotFoundResponse({ description: 'Comentário não encontrado', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Você não tem permissão para modificar este comentário', type: ErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos', type: ErrorResponseDto })
  updateComment(
    @Param() params: CommentIdParamDto,
    @Body() body: UpdateCommentFormDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.updateCommentUseCase.execute(params.commentId, body, user.sub);
  }

  @HttpDelete('comments/:commentId')
  @ApiOperation({
    summary: 'Excluir comentário (soft delete)',
    description: 'Marca um comentário como excluído',
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeleteCommentResponseDto })
  @ApiNotFoundResponse({ description: 'Comentário não encontrado', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Você não tem permissão para excluir este comentário', type: ErrorResponseDto })
  deleteComment(
    @Param() params: CommentIdParamDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.deleteCommentUseCase.execute(params.commentId, user.sub);
  }

  @HttpGet('posts/:postId/comments')
  @ApiOperation({
    summary: 'Listar comentários de um post',
    description: 'Retorna todos os comentários de um post em estrutura hierárquica',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetPostCommentsResponseDto })
  @ApiNotFoundResponse({ description: 'Post não encontrado', type: ErrorResponseDto })
  getPostComments(@Param() params: PostIdParamDto) {
    return this.getPostCommentsUseCase.execute(params.postId);
  }

  @HttpGet('comments/:commentId/replies')
  @ApiOperation({
    summary: 'Listar respostas de um comentário',
    description: 'Retorna todas as respostas de um comentário em formato de árvore',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetCommentRepliesResponseDto })
  @ApiNotFoundResponse({ description: 'Comentário não encontrado', type: ErrorResponseDto })
  getCommentReplies(@Param() params: CommentIdParamDto) {
    return this.getCommentRepliesUseCase.execute(params.commentId);
  }

  @HttpGet('comments/:commentId')
  @ApiOperation({
    summary: 'Obter comentário por ID',
    description: 'Retorna os detalhes de um comentário específico',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetCommentResponseDto })
  @ApiNotFoundResponse({ description: 'Comentário não encontrado', type: ErrorResponseDto })
  getComment(@Param() params: CommentIdParamDto) {
    return this.getCommentUseCase.execute(params.commentId);
  }

  @HttpGet('posts/:postId/comments/count')
  @ApiOperation({
    summary: 'Contar comentários de um post',
    description: 'Retorna a quantidade de comentários (excluindo deletados) de um post',
  })
  @ApiResponse({ status: HttpStatus.OK, type: CountPostCommentsResponseDto })
  @ApiNotFoundResponse({ description: 'Post não encontrado', type: ErrorResponseDto })
  countPostComments(@Param() params: PostIdParamDto) {
    return this.countPostCommentsUseCase.execute(params.postId);
  }
}