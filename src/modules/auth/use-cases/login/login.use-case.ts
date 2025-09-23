import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import type { ISessionRepository } from '@/modules/auth/repositories/session.repository';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { Session } from '@/modules/auth/entities/session.entity';
import { UserAdapter } from '@/modules/users/user.adapter';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';
import type { LoginDataDto } from '@/modules/auth/dtos';
import { InvalidCredentialsException } from '@/modules/auth/exceptions';
import { BaseResponseDto } from '@/common/dtos';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(JwtService)
    private readonly tokenService: JwtService,
    @Inject(SessionRepository)
    private readonly sessionRepository: ISessionRepository,
    private readonly userAdapter: UserAdapter,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<BaseResponseDto<LoginDataDto>> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await this.passwordHashingService.verifyPassword(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    const token = await this.tokenService.signAsync({
      sub: user.id,
      user: this.userAdapter.convertToDto(user),
    });
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

    const session = new Session({
      token,
      userId: user.id,
      expiresAt: expiresAt,
    });

    await this.sessionRepository.create(session);

    return {
      data: {
        token,
        tokenType: 'bearer',
        expiresAt,
        refreshToken: null,
        user: this.userAdapter.convertToDto(user),
      },
      message: 'Login realizado com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
