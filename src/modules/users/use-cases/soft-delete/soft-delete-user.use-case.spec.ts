import { SoftDeleteUserUseCase } from './soft-delete-user.use-case';
import { UserRepositorySpec } from '@/modules/users/repositories/user-spec.repository';
import { User } from '@/modules/users/entities/user.entity';

let softDeleteUserUseCase: SoftDeleteUserUseCase;
let userRepository: UserRepositorySpec;

let testUser: User;

describe('SoftDeleteUserUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    softDeleteUserUseCase = new SoftDeleteUserUseCase(userRepository);

    testUser = new User('Test User', 'test@example.com', 'password');
  });

  it('should soft delete an existing user', async () => {
    userRepository.users.push(testUser);

    expect(testUser.deletedAt).toBeUndefined();

    const result = await softDeleteUserUseCase.execute(testUser.id);

    expect(result).toHaveProperty('message', 'User deleted successfully');

    expect(testUser.deletedAt).toBeDefined();
    expect(testUser.deletedAt).not.toBeNull();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    await expect(softDeleteUserUseCase.execute('aaa')).rejects.toThrow(
      'User not found',
    );
  });
});
