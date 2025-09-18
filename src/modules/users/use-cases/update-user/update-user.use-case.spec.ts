import { UpdateUserUseCase } from './update-user.use-case';
import { UserRepositorySpec } from '@/modules/users/repositories/user-spec.repository';
import { User } from '@/modules/users/entities/user.entity';
import { UpdateUserFormDto } from '@/modules/users/dtos/update-user/update-user.form.dto';
import { UserAdapter } from '@/modules/users/user.adapter';

let updateUserUseCase: UpdateUserUseCase;
let userRepository: UserRepositorySpec;
let userAdapter: UserAdapter;

let testUser: User;
let updateData: UpdateUserFormDto;

describe('UpdateUserUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    userAdapter = new UserAdapter();
    updateUserUseCase = new UpdateUserUseCase(userRepository, userAdapter);

    testUser = new User('Original Name', 'original@example.com', 'password');
  });

  it('should update an existing user', async () => {
    userRepository.users.push(testUser);

    updateData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const result = await updateUserUseCase.execute(testUser.id, updateData);

    expect(result).toHaveProperty('message', 'User updated successfully');
    expect(result).toHaveProperty('user');

    expect(testUser.name).toBe('Updated Name');
    expect(testUser.email).toBe('updated@example.com');
  });

  it('should update only the name', async () => {
    userRepository.users.push(testUser);

    updateData = {
      name: 'Updated Name',
    };

    const result = await updateUserUseCase.execute(testUser.id, updateData);

    expect(result).toHaveProperty('message', 'User updated successfully');
    expect(result).toHaveProperty('user');

    expect(testUser.name).toBe('Updated Name');
    expect(testUser.email).toBe('original@example.com');
  });

  it('should update only the email', async () => {
    userRepository.users.push(testUser);

    updateData = {
      email: 'updated@example.com',
    };

    const result = await updateUserUseCase.execute(testUser.id, updateData);
    const userDto = userAdapter.convertToDto(testUser);

    expect(result).toHaveProperty('message', 'User updated successfully');
    expect(result).toHaveProperty('user', userDto);

    expect(testUser.name).toBe('Original Name');
    expect(testUser.email).toBe('updated@example.com');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    updateData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    await expect(updateUserUseCase.execute('aaa', updateData)).rejects.toThrow(
      'User not found',
    );
  });
});
