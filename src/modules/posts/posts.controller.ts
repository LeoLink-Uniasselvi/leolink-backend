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
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreatePostUseCase,
  GetPostUseCase,
  IndexPostsUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  GetUserPostsUseCase,
  GetFeedUseCase,
} from './use-cases';
import {
  CreatePostFormDto,
  CreatePostResponseDto,
  UpdatePostFormDto,
  UpdatePostResponseDto,
  GetPostResponseDto,
  IndexPostsResponseDto,
  DeletePostResponseDto,
  IndexPostsQueryDto,
} from './dtos';
import { PostAdapter } from './post.adapter';
import { ErrorResponseDto, IdParamDto } from '@/common/dtos';
import { GetUser } from '@/modules/auth/decorators';
import type { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getPostUseCase: GetPostUseCase,
    private indexPostsUseCase: IndexPostsUseCase,
    private updatePostUseCase: UpdatePostUseCase,
    private deletePostUseCase: DeletePostUseCase,
    private getUserPostsUseCase: GetUserPostsUseCase,
    private getFeedUseCase: GetFeedUseCase,
    private postAdapter: PostAdapter,
  ) {}

  // ==================== ROTAS ESPECÍFICAS PRIMEIRO ====================

  @Get('feed/following')
  @ApiOperation({ summary: 'Feed personalizado', description: 'Obtém posts de usuários que você segue' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Feed obtido com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  async getFeed(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @GetUser() user: JwtPayload,
  ) {
    const result = await this.getFeedUseCase.execute(user.sub, +page, +limit);
    return {
      items: await this.postAdapter.toDtoArray(result.posts, user.sub),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrevious: result.page > 1,
      },
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Posts de um usuário', description: 'Obtém posts de um usuário específico' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts obtidos com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  async getUserPosts(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @GetUser() user: JwtPayload,
  ) {
    const result = await this.getUserPostsUseCase.execute(params.userId, +page, +limit);
    return {
      items: await this.postAdapter.toDtoArray(result.posts, user.sub),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrevious: result.page > 1,
      },
    };
  }

  // ==================== ROTAS CRUD ====================

  @Post()
  @ApiOperation({ summary: 'Criar post', description: 'Cria um novo post' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreatePostResponseDto, description: 'Post criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  async create(
    @Body() createPostDto: CreatePostFormDto,
    @GetUser() user: JwtPayload,
  ): Promise<CreatePostResponseDto> {
    console.log('[PostsController] Criando post:', { content: createPostDto.content, userId: user.sub });
    
    const post = await this.createPostUseCase.execute(createPostDto.content, user.sub);
    
    console.log('[PostsController] Post criado:', { id: post.id, authorId: post.authorId, hasAuthor: !!post.author });
    
    const data = await this.postAdapter.toDto(post, user.sub);
    
    console.log('[PostsController] DTO gerado:', data);
    
    return {
      data,
      message: 'Post criado com sucesso',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar posts', description: 'Obtém lista paginada de posts' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: HttpStatus.OK, type: IndexPostsResponseDto, description: 'Lista de posts' })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  async findAll(@Query() query: IndexPostsQueryDto, @GetUser() user: JwtPayload): Promise<IndexPostsResponseDto> {
    console.log('[PostsController] GET /posts - Query:', query);
    const result = await this.indexPostsUseCase.execute(query.page, query.limit, query.search);
    console.log('[PostsController] GET /posts - Resultado:', {
      totalPosts: result.posts?.length,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    });
    return {
      items: await this.postAdapter.toDtoArray(result.posts, user.sub),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrevious: result.page > 1,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar post', description: 'Obtém um post pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, type: GetPostResponseDto, description: 'Post encontrado' })
  @ApiNotFoundResponse({ description: 'Post não encontrado', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  async findOne(@Param() params: IdParamDto, @GetUser() user: JwtPayload): Promise<GetPostResponseDto> {
    const post = await this.getPostUseCase.execute(params.id);
    const data = await this.postAdapter.toDto(post, user.sub);
    return {
      data,
      message: 'Post encontrado com sucesso',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar post', description: 'Atualiza um post existente' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdatePostResponseDto, description: 'Post atualizado' })
  @ApiBadRequestResponse({ description: 'Dados inválidos', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Post não encontrado', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Sem permissão', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  async update(
    @Param() params: IdParamDto,
    @Body() updatePostDto: UpdatePostFormDto,
    @GetUser() user: JwtPayload,
  ): Promise<UpdatePostResponseDto> {
    const post = await this.updatePostUseCase.execute(params.id, updatePostDto.content!, user.sub);
    const data = await this.postAdapter.toDto(post, user.sub);
    return {
      data,
      message: 'Post atualizado com sucesso',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar post', description: 'Remove um post (soft delete)' })
  @ApiResponse({ status: HttpStatus.OK, type: DeletePostResponseDto, description: 'Post deletado' })
  @ApiNotFoundResponse({ description: 'Post não encontrado', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Sem permissão', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente', type: ErrorResponseDto })
  async remove(
    @Param() params: IdParamDto,
    @GetUser() user: JwtPayload,
  ): Promise<DeletePostResponseDto> {
    await this.deletePostUseCase.execute(params.id, user.sub);
    return {
      data: null,
      message: 'Post deletado com sucesso',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
