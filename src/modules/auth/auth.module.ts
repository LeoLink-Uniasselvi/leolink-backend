import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { LoginUseCase, LogoutUseCase } from './use-cases';
import { SessionRepository } from './repositories/session.repository';
import { Session } from './entities/session.entity';
import { GetSessionByToken } from './utils/get-session-by-token';
import { UserAdapter } from '@/modules/users/user.adapter';
import { PasswordHashingService } from './services/password-hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
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
    GetSessionByToken,
    UserAdapter,
    PasswordHashingService,
  ],
  exports: [UserRepository, GetSessionByToken, PasswordHashingService],
})
export class AuthModule {}
