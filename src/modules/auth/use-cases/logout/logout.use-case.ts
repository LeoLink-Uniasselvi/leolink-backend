import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '@/modules/auth/repositories/session.repository';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { BaseResponseDto } from '@/common/dtos';
import { SessionNotFoundException } from '@/modules/auth/exceptions';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(SessionRepository)
    private sessionRepository: ISessionRepository,
  ) {}

  async execute(token: string): Promise<BaseResponseDto<null>> {
    const session = await this.sessionRepository.findByToken(token);

    if (!session) {
      throw new SessionNotFoundException();
    }

    await this.sessionRepository.delete(session.id);

    return {
      message: 'Logout realizado com sucesso',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  }
}
