import { ActivateUserUseCase } from './activate-user.use-case';
import { UserRepositorySpec } from '@/modules/users/repositories/user-spec.repository';
import { User } from '@/modules/users/entities/user.entity';
import { UserAdapter } from '@/modules/users/user.adapter';

let activateUserUseCase: ActivateUserUseCase;
let userRepository: UserRepositorySpec;
let userAdapter: UserAdapter;

let deletedUser: User;
let activeUser: User;

describe('ActivateUserUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    userAdapter = new UserAdapter();
    activateUserUseCase = new ActivateUserUseCase(userRepository, userAdapter);

    deletedUser = new User('Deleted User', 'deleted@example.com', 'password');
    deletedUser.deletedAt = new Date();

    activeUser = new User('Active User', 'active@example.com', 'password');
  });

  it('should activate a deleted user', async () => {
    userRepository.users.push(deletedUser);

    expect(userRepository.users.length).toBe(1);

    const result = await activateUserUseCase.execute(deletedUser.id);
    const userDto = userAdapter.convertToDto(deletedUser);

    expect(result).toHaveProperty('message', 'User activated successfully');
    expect(result).toHaveProperty('user', userDto);

    expect(deletedUser.deletedAt).toBeNull();
  });

  it('should throw NotFoundException when user is not found', async () => {
    await expect(activateUserUseCase.execute('aaa')).rejects.toThrow(
      'User not found',
    );
  });

  it('should throw UnprocessableEntityException when user is not deleted', async () => {
    userRepository.users.push(activeUser);

    expect(userRepository.users.length).toBe(1);

    await expect(activateUserUseCase.execute(activeUser.id)).rejects.toThrow(
      'User is not deleted',
    );
  });
});
