import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@/modules/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { LoginUseCase, LogoutUseCase, MeUseCase, RegisterUseCase } from './use-cases';
import { SessionRepository } from './repositories/session.repository';
import { Session } from './entities/session.entity';
import { GetSessionByToken } from './utils/get-session-by-token';
import { UserAdapter } from '@/modules/users/user.adapter';
import { PasswordHashingService } from './services/password-hashing.service';
import { AuthGuard } from './guards/auth-guard.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    SessionRepository,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    LoginUseCase,
    LogoutUseCase,
    MeUseCase,
    RegisterUseCase,
    GetSessionByToken,
    UserAdapter,
    PasswordHashingService,
    AuthGuard,
  ],
  exports: [UserRepository, GetSessionByToken, PasswordHashingService, JwtModule, AuthGuard],
})
export class AuthModule {}
