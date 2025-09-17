import { LoginUseCase, ChangePasswordUseCase, LogoutUseCase } from './index';

describe('Auth use cases', () => {
  it('should export all use cases', () => {
    expect(LoginUseCase).toBeDefined();
    expect(ChangePasswordUseCase).toBeDefined();
    expect(LogoutUseCase).toBeDefined();
  });
});