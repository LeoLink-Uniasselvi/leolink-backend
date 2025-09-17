import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { UserRepository } from '../users/repos/user.repository';
import { LoginUseCase, LogoutUseCase } from './use-cases';
import { SessionRepository } from './repos/session.repository';
import { Session } from './entities/session.entity';
import { GetSessionByToken } from './utils/get-session-by-token';
import { UserAdapter } from '../users/user.adapter';

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
  ],
  exports: [UserRepository, GetSessionByToken],
})
export class AuthModule {}
