import { Session } from '@/modules/auth/entities/session.entity';
import { LogoutUseCase } from './logout.use-case';
import { SessionRepositorySpec } from '@/modules/auth/repositories/session-spec.repository';
let logoutUseCase: LogoutUseCase;
let sessionRepository: SessionRepositorySpec;

describe('LogoutUseCase', () => {
  beforeEach(() => {
    sessionRepository = new SessionRepositorySpec();

    logoutUseCase = new LogoutUseCase(sessionRepository);
  });

  it('should logout a user by revoking the session token', async () => {
    const token = 'test-token';

    const session = new Session({
      token: token,
      userId: '1',
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60),
      revokedAt: new Date(new Date().getTime() + 1000 * 60 * 60),
    });

    sessionRepository.sessions.push(session);

    expect(session.revokedAt).toBeNull();

    const result = await logoutUseCase.execute(token);

    expect(result).toHaveProperty('message', 'User logged out successfully');
    expect(session.revokedAt).not.toBeNull();
  });

  it('should handle logout when token does not exist', async () => {
    const token = 'non-existent-token';

    const result = await logoutUseCase.execute(token);

    expect(result).toHaveProperty('message', 'User not found');

    expect(sessionRepository.sessions.length).toBe(0);
  });

  it('should handle logout when token is already revoked', async () => {
    const token = 'test-token';

    const session = new Session({
      token: token,
      userId: '1',
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60),
      revokedAt: new Date(new Date().getTime() - 1000 * 60 * 60),
    });

    session.revokedAt = new Date();
    sessionRepository.sessions.push(session);

    const result = await logoutUseCase.execute(token);

    expect(result).toHaveProperty('message', 'User logged out successfully');

    expect(session.revokedAt).not.toBeNull();

    const result2 = await logoutUseCase.execute(token);

    expect(result2).toHaveProperty('message', 'User logged out successfully');

    expect(session.revokedAt).not.toBeNull();

    expect(session.revokedAt).toBe(session.revokedAt);
  });
});
