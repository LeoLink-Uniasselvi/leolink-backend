import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, UserRepository } from '../../../users/repos/user.repository';
import { ISessionRepository, SessionRepository } from '../../repos/session.repository';
import { Session } from '../../entities/session.entity';
import { UserAdapter } from '../../../users/user.adapter';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(JwtService)
    private readonly tokenService: JwtService,
    @Inject(SessionRepository)
    private readonly sessionRepository: ISessionRepository,
    private readonly userAdapter: UserAdapter
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await user.checkPassword(password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.tokenService.signAsync({
      sub: user.id,
      user: this.userAdapter.convertToDto(user),
    });
    const expiratedAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

    const session = new Session(token, user.id, expiratedAt);

    await this.sessionRepository.create(session);

    return {
      message: 'User logged in successfully',
      token: token,
    };
  }
}