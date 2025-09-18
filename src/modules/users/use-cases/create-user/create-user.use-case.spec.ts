import { CreateUserUseCase } from './create-user.use-case';
import { UserRepositorySpec } from '@/modules/users/repositories/user-spec.repository';
import { CreateUserFormDto } from '@/modules/users/dtos';
import { UserAdapter } from '@/modules/users/user.adapter';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';

let createUserUseCase: CreateUserUseCase;
let userRepository: UserRepositorySpec;
let userAdapter: UserAdapter;
let passwordHashingService: Partial<PasswordHashingService>;

let testUser: CreateUserFormDto;

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    userAdapter = new UserAdapter();

    // Mock tipado do PasswordHashingService
    passwordHashingService = {
      hashPassword: jest.fn().mockResolvedValue('hashed-password'),
      verifyPassword: jest.fn().mockResolvedValue(true),
    };

    createUserUseCase = new CreateUserUseCase(
      userRepository,
      userAdapter,
      passwordHashingService as PasswordHashingService,
    );

    jest.useFakeTimers();

    testUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    };
  });

  it('should create a user', async () => {
    expect(userRepository.users.length).toBe(0);

    const result = await createUserUseCase.execute(testUser);
    const user = userAdapter.convertCreateUserDtoToEntity(testUser);
    const userDto = userAdapter.convertToDto(user);

    expect(result).toHaveProperty('message', 'User created successfully');
    expect(result).toHaveProperty('user', userDto);

    expect(userRepository.users.length).toBe(1);
  });

  it('should throw an error when user already exists', async () => {
    expect(userRepository.users.length).toBe(0);

    await createUserUseCase.execute(testUser);

    expect(userRepository.users.length).toBe(1);

    await expect(createUserUseCase.execute(testUser)).rejects.toThrow(
      'User already exists',
    );

    expect(userRepository.users.length).toBe(1);
  });
});
