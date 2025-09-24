import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAdapter } from '@/modules/users/user.adapter';
import { RegisterFormDto, RegisterDataDto } from '@/modules/auth/dtos';
import type { IUserRepository } from '@/modules/users/repositories/user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import type { ISessionRepository } from '@/modules/auth/repositories/session.repository';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { Session } from '@/modules/auth/entities/session.entity';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';
import { UserAlreadyExistsException } from '@/modules/users/exceptions';
import { BaseResponseDto } from '@/common/dtos';

@Injectable()
export class RegisterUseCase {
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

  async execute(input: RegisterFormDto): Promise<BaseResponseDto<RegisterDataDto>> {
    const checkUser = await this.userRepository.findByEmail(input.email);

    if (checkUser) {
      throw new UserAlreadyExistsException();
    }

    const user = this.userAdapter.convertCreateUserDtoToEntity(input);

    const hashedPassword = await this.passwordHashingService.hashPassword(
      user.password,
    );
    user.updatePassword(hashedPassword);

    await this.userRepository.create(user);

    // Auto login após registro
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
        user: this.userAdapter.convertToDto(user),
      },
      message: 'Usuário registrado e logado com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 201,
    };
  }
}