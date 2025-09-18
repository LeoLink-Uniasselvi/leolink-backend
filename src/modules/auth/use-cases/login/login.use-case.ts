import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import type { ISessionRepository } from '@/modules/auth/repositories/session.repository';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { Session } from '@/modules/auth/entities/session.entity';
import { UserAdapter } from '@/modules/users/user.adapter';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';

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

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await this.passwordHashingService.verifyPassword(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
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
      message: 'User logged in successfully',
      token: token,
    };
  }
}
