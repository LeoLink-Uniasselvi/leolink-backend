import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { Session } from '@/modules/auth/entities/session.entity';

@Injectable()
export class GetSessionByToken {
  constructor(
    @Inject(SessionRepository)
    private sessionRepository: SessionRepository,
  ) {}

  async execute(token: string): Promise<Session | null> {
    const session = await this.sessionRepository.findByToken(token);

    return session;
  }
}
