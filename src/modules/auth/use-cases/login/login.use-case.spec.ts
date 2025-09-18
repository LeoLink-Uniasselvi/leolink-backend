import { LoginUseCase } from './login.use-case';
import { UserRepositorySpec } from '@/modules/users/repositories/user-spec.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/users/entities/user.entity';
import { SessionRepositorySpec } from '@/modules/auth/repositories/session-spec.repository';
import { UserAdapter } from '@/modules/users/user.adapter';
import { PasswordHashingService } from '@/modules/auth/services/password-hashing.service';

// Mock do uuid
jest.mock('uuid', () => ({
  v7: jest.fn(() => 'mocked-uuid-v7'),
}));

let loginUseCase: LoginUseCase;
let userRepository: UserRepositorySpec;
let sessionRepository: SessionRepositorySpec;
let jwtService: JwtService;
let userAdapter: UserAdapter;
let passwordHashingService: PasswordHashingService;

let testUser: User;

describe('LoginUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    sessionRepository = new SessionRepositorySpec();
    jwtService = new JwtService({
      secret: 'test-secret',
    });
    userAdapter = new UserAdapter();

    // Mock do PasswordHashingService
    passwordHashingService = {
      hashPassword: jest.fn().mockResolvedValue('hashed-password'),
      verifyPassword: jest.fn(),
    } as unknown as PasswordHashingService;

    loginUseCase = new LoginUseCase(
      userRepository,
      jwtService,
      sessionRepository,
      userAdapter,
      passwordHashingService,
    );

    testUser = new User('Test User', 'test@example.com', 'password123');
  });

  it('should login a user with valid credentials', async () => {
    // Mock da verificação de senha como verdadeira
    const verifyPasswordSpy = jest
      .spyOn(passwordHashingService, 'verifyPassword')
      .mockResolvedValue(true);

    // Simula uma senha já hasheada
    testUser.updatePassword('hashed-password123');
    await userRepository.create(testUser);

    const result = await loginUseCase.execute(testUser.email, 'password123');

    expect(result).toHaveProperty('message', 'User logged in successfully');
    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');

    expect(sessionRepository.sessions.length).toBe(1);
    const session = sessionRepository.sessions[0];
    expect(session.token).toBe(result.token);
    expect(session.userId).toBe(testUser.id);

    // Verifica se o método de verificação foi chamado corretamente
    expect(verifyPasswordSpy).toHaveBeenCalledWith(
      'password123',
      'hashed-password123',
    );
  });

  it('should throw UnauthorizedException when email is invalid', async () => {
    await expect(
      loginUseCase.execute('invalid@example.com', 'password123'),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    // Mock da verificação de senha como falsa
    const verifyPasswordSpy = jest
      .spyOn(passwordHashingService, 'verifyPassword')
      .mockResolvedValue(false);

    // Simula uma senha já hasheada
    testUser.updatePassword('hashed-password123');
    await userRepository.create(testUser);

    await expect(
      loginUseCase.execute(testUser.email, 'wrongpassword'),
    ).rejects.toThrow('Invalid email or password');

    // Verifica se o método de verificação foi chamado corretamente
    expect(verifyPasswordSpy).toHaveBeenCalledWith(
      'wrongpassword',
      'hashed-password123',
    );
  });
});
