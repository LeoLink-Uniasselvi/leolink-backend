import {
  ActivateUserUseCase,
  CreateUserUseCase,
  GenerateDefaultUserUseCase,
  GetUserUseCase,
  IndexUsersUseCase,
  SoftDeleteUserUseCase,
  UpdateUserUseCase,
} from './index';

describe('User use cases', () => {
  it('should export all use cases', () => {
    expect(ActivateUserUseCase).toBeDefined();
    expect(CreateUserUseCase).toBeDefined();
    expect(GenerateDefaultUserUseCase).toBeDefined();
    expect(GetUserUseCase).toBeDefined();
    expect(IndexUsersUseCase).toBeDefined();
    expect(SoftDeleteUserUseCase).toBeDefined();
    expect(UpdateUserUseCase).toBeDefined();
  });
});
