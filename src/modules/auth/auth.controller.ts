import { Body, Controller, Post, Get, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LoginFormDto, LoginResponseDto, LogoutResponseDto, MeResponseDto } from './dtos';
import { LoginUseCase, LogoutUseCase, MeUseCase } from './use-cases';
import { Public, GetUser, GetJwt } from './decorators';
import type { JwtPayload } from './types/jwt-payload.interface';
import { ErrorResponseDto } from '@/common/dtos';

@ApiTags('Autenticação')
@Controller()
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private logoutUseCase: LogoutUseCase,
    private meUseCase: MeUseCase,
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica o usuário com email e senha',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
    description: 'Login realizado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    type: ErrorResponseDto,
  })
  login(@Body() loginDto: LoginFormDto) {
    return this.loginUseCase.execute(loginDto.email, loginDto.password);
  }

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout do usuário',
    description: 'Faz logout do usuário e invalida o token JWT',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LogoutResponseDto,
    description: 'Logout realizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sessão não encontrada',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  logout(@GetJwt() jwt: string) {
    return this.logoutUseCase.execute(jwt);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obter usuário atual',
    description: 'Obtém informações sobre o usuário autenticado atualmente',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MeResponseDto,
    description: 'Informações do usuário recuperadas com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    type: ErrorResponseDto,
  })
  me(@GetUser() jwtPayload: JwtPayload) {
    return this.meUseCase.execute(jwtPayload);
  }
}
