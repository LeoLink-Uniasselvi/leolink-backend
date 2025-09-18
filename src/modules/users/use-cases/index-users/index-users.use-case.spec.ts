import { IndexUsersUseCase } from './index-users.use-case';
import { UserRepositorySpec } from '@/modules/users/repositories/user-spec.repository';
import { User } from '@/modules/users/entities/user.entity';
import { UserAdapter } from '@/modules/users/user.adapter';

let indexUsersUseCase: IndexUsersUseCase;
let userRepository: UserRepositorySpec;
let userAdapter: UserAdapter;

let user1: User;
let user2: User;

describe('IndexUsersUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    userAdapter = new UserAdapter();
    indexUsersUseCase = new IndexUsersUseCase(userRepository, userAdapter);

    user1 = new User('User One', 'userone@example.com', 'password1');
    user2 = new User('User Two', 'usertwo@example.com', 'password2');
  });

  it('should return a list of users when users exist', async () => {
    userRepository.users.push(user1, user2);

    const result = await indexUsersUseCase.execute();
    const userDto1 = userAdapter.convertToDto(user1);
    const userDto2 = userAdapter.convertToDto(user2);

    expect(result).toHaveProperty('message', 'Users found');
    expect(result).toHaveProperty('users');
    expect(result.users.length).toBe(2);
    expect(result.users).toContainEqual(userDto1);
    expect(result.users).toContainEqual(userDto2);
  });

  it('should throw NotFoundException when no users exist', async () => {
    await expect(indexUsersUseCase.execute()).rejects.toThrow(
      'Users not found',
    );
  });
});
