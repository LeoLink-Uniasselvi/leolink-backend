import { GenerateDefaultUserUseCase } from './generate-default-user.use-case';
import { UserRepositorySpec } from '@/modules/users/repositories/user-spec.repository';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user/create-user.use-case';
import { User } from '@/modules/users/entities/user.entity';
import { UserAdapter } from '@/modules/users/user.adapter';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';

let generateDefaultUserUseCase: GenerateDefaultUserUseCase;
let userRepository: UserRepositorySpec;
let createUserUseCase: CreateUserUseCase;
let userAdapter: UserAdapter;
let passwordHashingService: Partial<PasswordHashingService>;

let testUser: User;

describe('GenerateDefaultUserUseCase', () => {
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
    generateDefaultUserUseCase = new GenerateDefaultUserUseCase(
      userRepository,
      createUserUseCase,
    );

    testUser = new User('Existing User', 'existing@example.com', 'password123');
  });

  it('should create a default user when no users exist', async () => {
    // Mock do hashPassword para verificar se foi chamado
    const hashPasswordSpy = jest
      .spyOn(passwordHashingService, 'hashPassword')
      .mockResolvedValue('hashed-admin-password');

    expect(userRepository.users.length).toBe(0);

    await generateDefaultUserUseCase.execute();

    expect(userRepository.users.length).toBe(1);

    const createdUser = userRepository.users[0];

    expect(createdUser.name).toBe('Admin');
    expect(createdUser.email).toBe('admin@admin.com');
    expect(createdUser.password).toBe('hashed-admin-password');
    expect(createdUser.password).not.toBe('admin');

    // Verifica se o método de hash foi chamado com a senha original
    expect(hashPasswordSpy).toHaveBeenCalledWith('admin');
  });

  it('should not create a default user when users already exist', async () => {
    userRepository.users.push(testUser);

    expect(userRepository.users.length).toBe(1);

    await generateDefaultUserUseCase.execute();

    expect(userRepository.users.length).toBe(1);
    expect(userRepository.users[0]).toBe(testUser);
  });

  it('should create default user with environment variables when provided', async () => {
    // Mock das variáveis de ambiente
    process.env.DEFAULT_USER_NAME = 'SuperAdmin';
    process.env.DEFAULT_USER_EMAIL = 'superadmin@example.com';
    process.env.DEFAULT_USER_PASS = 'superpassword';

    const hashPasswordSpy = jest
      .spyOn(passwordHashingService, 'hashPassword')
      .mockResolvedValue('hashed-superpassword');

    expect(userRepository.users.length).toBe(0);

    await generateDefaultUserUseCase.execute();

    expect(userRepository.users.length).toBe(1);

    const createdUser = userRepository.users[0];

    expect(createdUser.name).toBe('SuperAdmin');
    expect(createdUser.email).toBe('superadmin@example.com');
    expect(createdUser.password).toBe('hashed-superpassword');

    // Verifica se o método de hash foi chamado com a senha das variáveis de ambiente
    expect(hashPasswordSpy).toHaveBeenCalledWith('superpassword');

    // Limpa as variáveis de ambiente após o teste
    delete process.env.DEFAULT_USER_NAME;
    delete process.env.DEFAULT_USER_EMAIL;
    delete process.env.DEFAULT_USER_PASS;
  });

  it('should not create default user when soft-deleted users exist', async () => {
    // Cria um usuário deletado (soft delete)
    const deletedUser = new User(
      'Deleted User',
      'deleted@example.com',
      'password123',
    );
    deletedUser.deletedAt = new Date();
    userRepository.users.push(deletedUser);

    expect(userRepository.users.length).toBe(1);

    await generateDefaultUserUseCase.execute();

    // Não deve criar um novo usuário porque já existe um (mesmo que deletado)
    expect(userRepository.users.length).toBe(1);
    expect(userRepository.users[0]).toBe(deletedUser);
  });
});
