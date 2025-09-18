import { LoginUseCase, LogoutUseCase } from './index';

describe('Auth use cases', () => {
  it('should export all use cases', () => {
    expect(LoginUseCase).toBeDefined();
    expect(LogoutUseCase).toBeDefined();
  });
});
