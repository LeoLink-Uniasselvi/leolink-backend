import { ChangePasswordUseCase } from './change-password.use-case';
import { UserRepositorySpec } from '../../../users/repos/user-spec.repository';
import { User } from '../../../users/entities/user.entity';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { UserAdapter } from '../../../users/user.adapter';

let changePasswordUseCase: ChangePasswordUseCase;
let userRepository: UserRepositorySpec;
let userAdapter: UserAdapter;

let testUser: User;
let changePasswordData: ChangePasswordDto;

describe('ChangePasswordUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    userAdapter = new UserAdapter();
    changePasswordUseCase = new ChangePasswordUseCase(userRepository, userAdapter);

    testUser = new User('Test User', 'test@example.com', 'oldPassword');
  });

  it('should change the password of an existing user', async () => {
    await testUser.hashPassword();
    userRepository.users.push(testUser);

    changePasswordData = {
      id: testUser.id,
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
      passwordConfirmation: 'newPassword',
    };

    const result = await changePasswordUseCase.execute(changePasswordData);

    expect(result).toHaveProperty('id', testUser.id);
    expect(result).toHaveProperty('name', testUser.name);
    expect(result).toHaveProperty('email', testUser.email);

    expect(testUser.password).not.toBe('newPassword');
    const isPasswordValid = await testUser.checkPassword('newPassword');
    expect(isPasswordValid).toBe(true);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    changePasswordData = {
      id: 999,
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
      passwordConfirmation: 'newPassword',
    };

    await expect(changePasswordUseCase.execute(changePasswordData)).rejects.toThrow('User not found');
  });

  it('should throw UnauthorizedException when old password is incorrect', async () => {
    await testUser.hashPassword();
    userRepository.users.push(testUser);

    changePasswordData = {
      id: testUser.id,
      oldPassword: 'wrongPassword',
      newPassword: 'newPassword',
      passwordConfirmation: 'newPassword',
    };

    await expect(changePasswordUseCase.execute(changePasswordData)).rejects.toThrow('Incorrect password');
  });
});