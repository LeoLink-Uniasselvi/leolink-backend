import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpStatus,
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
import { GetUser, Public } from '@/modules/auth/decorators';
import type { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';
import {
  CreatePostFormDto,
  CreatePostResponseDto,
  UpdatePostFormDto,
  UpdatePostResponseDto,
  DeletePostResponseDto,
  GetPostResponseDto,
  ListPostsQueryDto,
  ListPostsResponseDto,
  PostIdParamDto,
  FeedPostsQueryDto,
  FeedResponseDto,
  ManageCategoriesDto,
  ManageCategoriesResponseDto,
  PostViewsResponseDto,
} from './post.dtos';
import { CreatePostUseCase } from './create-post.use-case';
import { UpdatePostUseCase } from './update-post.use-case';
import { DeletePostUseCase } from './delete-post.use-case';
import { GetPostUseCase } from './get-post.use-case';
import { ListPostsUseCase } from './list-posts.use-case';
import { GetPostsByUserUseCase } from './get-posts-by-user.use-case';
import { GetPostsByCategoryUseCase } from './get-posts-by-category.use-case';
import { GetFeedPostsUseCase } from './get-feed-posts.use-case';
import { AddCategoriesToPostUseCase } from './add-categories-to-post.use-case';
import { RemoveCategoriesFromPostUseCase } from './remove-categories-from-post.use-case';
import { TrackPostViewUseCase } from './track-post-view.use-case';
import { GetPostViewsUseCase } from './get-post-views.use-case';
import { ErrorResponseDto } from '@/common/dtos';

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly getPostsByUserUseCase: GetPostsByUserUseCase,
    private readonly getPostsByCategoryUseCase: GetPostsByCategoryUseCase,
    private readonly getFeedPostsUseCase: GetFeedPostsUseCase,
    private readonly addCategoriesToPostUseCase: AddCategoriesToPostUseCase,
    private readonly removeCategoriesFromPostUseCase: RemoveCategoriesFromPostUseCase,
    private readonly trackPostViewUseCase: TrackPostViewUseCase,
    private readonly getPostViewsUseCase: GetPostViewsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar post' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreatePostResponseDto,
    description: 'Post criado com sucesso',
  })
  @ApiBadRequestResponse({ description: 'Dados invalidos', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido', type: ErrorResponseDto })
  async create(
    @Body() body: CreatePostFormDto,
    @GetUser() user: JwtPayload,
  ): Promise<CreatePostResponseDto> {
    return this.createPostUseCase.execute(body, user.sub);
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'Atualizar post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdatePostResponseDto,
    description: 'Post atualizado com sucesso',
  })
  @ApiBadRequestResponse({ description: 'Dados invalidos', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Sem permissao', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Post nao encontrado', type: ErrorResponseDto })
  async update(
    @Param() params: PostIdParamDto,
    @Body() body: UpdatePostFormDto,
    @GetUser() user: JwtPayload,
  ): Promise<UpdatePostResponseDto> {
    return this.updatePostUseCase.execute(params.postId, body, user.sub);
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Remover post (soft delete)' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeletePostResponseDto,
    description: 'Post removido com sucesso',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Sem permissao', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Post nao encontrado', type: ErrorResponseDto })
  async delete(
    @Param() params: PostIdParamDto,
    @GetUser() user: JwtPayload,
  ): Promise<DeletePostResponseDto> {
    return this.deletePostUseCase.execute(params.postId, user.sub);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Feed personalizado (cursor-based)' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido', type: ErrorResponseDto })
  async feed(
    @Query() query: FeedPostsQueryDto,
    @GetUser() user: JwtPayload,
  ): Promise<FeedResponseDto> {
    return this.getFeedPostsUseCase.execute(user.sub, query);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar posts com filtros e paginacao' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ListPostsResponseDto,
    description: 'Posts listados com sucesso',
  })
  @ApiBadRequestResponse({ description: 'Parametros invalidos', type: ErrorResponseDto })
  async list(@Query() query: ListPostsQueryDto): Promise<ListPostsResponseDto> {
    return this.listPostsUseCase.execute(query);
  }

  @Get(':postId')
  @Public()
  @ApiOperation({ summary: 'Obter post por ID (registra visualizacao para autenticado)' })
  @ApiResponse({ status: HttpStatus.OK, type: GetPostResponseDto })
  @ApiNotFoundResponse({ description: 'Post nao encontrado', type: ErrorResponseDto })
  async get(
    @Param() params: PostIdParamDto,
    @GetUser() user?: JwtPayload,
  ): Promise<GetPostResponseDto> {
    return this.getPostUseCase.execute(params.postId, user?.sub);
  }

  @Get('by-user/:userId')
  @Public()
  @ApiOperation({ summary: 'Listar posts de um usuario' })
  @ApiResponse({ status: HttpStatus.OK, type: ListPostsResponseDto })
  async getByUser(
    @Param('userId') userId: string,
    @Query() query: Omit<ListPostsQueryDto, 'authorId'>,
  ): Promise<ListPostsResponseDto> {
    return this.getPostsByUserUseCase.execute(userId, query);
  }

  @Get('by-category/:categoryId')
  @Public()
  @ApiOperation({ summary: 'Listar posts por categoria' })
  @ApiResponse({ status: HttpStatus.OK, type: ListPostsResponseDto })
  async getByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: Omit<ListPostsQueryDto, 'categoryId'>,
  ): Promise<ListPostsResponseDto> {
    return this.getPostsByCategoryUseCase.execute(categoryId, query);
  }

  @Post(':postId/categories')
  @ApiOperation({ summary: 'Adicionar categorias a um post' })
  @ApiResponse({ status: HttpStatus.OK, type: ManageCategoriesResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Sem permissao', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Post ou categoria nao encontrada', type: ErrorResponseDto })
  async addCategories(
    @Param() params: PostIdParamDto,
    @Body() body: ManageCategoriesDto,
    @GetUser() user: JwtPayload,
  ): Promise<ManageCategoriesResponseDto> {
    return this.addCategoriesToPostUseCase.execute(
      params.postId,
      body,
      user.sub,
    );
  }

  @Delete(':postId/categories')
  @ApiOperation({ summary: 'Remover categorias de um post' })
  @ApiResponse({ status: HttpStatus.OK, type: ManageCategoriesResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Sem permissao', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Post nao encontrado', type: ErrorResponseDto })
  async removeCategories(
    @Param() params: PostIdParamDto,
    @Body() body: ManageCategoriesDto,
    @GetUser() user: JwtPayload,
  ): Promise<ManageCategoriesResponseDto> {
    return this.removeCategoriesFromPostUseCase.execute(
      params.postId,
      body,
      user.sub,
    );
  }

  @Post(':postId/views')
  @ApiOperation({ summary: 'Registrar visualizacao de post' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Visualizacao registrada' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Post nao encontrado', type: ErrorResponseDto })
  async trackView(
    @Param() params: PostIdParamDto,
    @GetUser() user: JwtPayload,
  ) {
    await this.trackPostViewUseCase.execute(params.postId, user.sub);
    return {
      data: null,
      message: 'Visualizacao registrada com sucesso',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':postId/views')
  @Public()
  @ApiOperation({ summary: 'Obter estatisticas de visualizacao de um post' })
  @ApiResponse({ status: HttpStatus.OK, type: PostViewsResponseDto })
  @ApiNotFoundResponse({ description: 'Post nao encontrado', type: ErrorResponseDto })
  async getViews(
    @Param() params: PostIdParamDto,
  ): Promise<PostViewsResponseDto> {
    return this.getPostViewsUseCase.execute(params.postId);
  }
}
