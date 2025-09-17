import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../repos/session.repository';

@Injectable()
export class GetSessionByToken {
  constructor(
    @Inject(SessionRepository)
    private sessionRepository: SessionRepository
  ) {}

  async execute(token: string) {
    const session = await this.sessionRepository.findByToken(token);

    return session;
  }
}