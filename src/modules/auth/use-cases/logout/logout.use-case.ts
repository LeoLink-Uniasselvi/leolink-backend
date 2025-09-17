import { Inject, Injectable } from '@nestjs/common';
import { ISessionRepository, SessionRepository } from '../../repos/session.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(SessionRepository)
    private sessionRepository: ISessionRepository
  ) {}

  async execute(token: string) {
    const session = await this.sessionRepository.findByToken(token);

    if (!session) {
      return {
        message: 'User not found',
      };
    }

    await this.sessionRepository.delete(session.id);

    return {
      message: 'User logged out successfully',
    };
  }
}