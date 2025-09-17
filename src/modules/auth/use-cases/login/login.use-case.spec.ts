import { LoginUseCase } from './login.use-case';
import { UserRepositorySpec } from '../../../users/repos/user-spec.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../users/entities/user.entity';
import { SessionRepositorySpec } from '../../repos/session-spec.repository';
import { UserAdapter } from '../../../users/user.adapter';

let loginUseCase: LoginUseCase;
let userRepository: UserRepositorySpec;
let sessionRepository: SessionRepositorySpec;
let jwtService: JwtService;
let userAdapter: UserAdapter;

let testUser: User;

describe('LoginUseCase', () => {
  beforeEach(() => {
    userRepository = new UserRepositorySpec();
    sessionRepository = new SessionRepositorySpec();
    jwtService = new JwtService({
      secret: 'test-secret',
    });
    userAdapter = new UserAdapter();

    loginUseCase = new LoginUseCase(userRepository, jwtService, sessionRepository, userAdapter);

    testUser = new User('Test User', 'test@example.com', 'password123');
  });

  it('should login a user with valid credentials', async () => {
    await testUser.hashPassword();
    userRepository.users.push(testUser);

    const result = await loginUseCase.execute(testUser.email, 'password123');

    expect(result).toHaveProperty('message', 'User logged in successfully');
    expect(result).toHaveProperty('token');

    expect(sessionRepository.sessions.length).toBe(1);
    const session = sessionRepository.sessions[0];
    expect(session.token).toBe(result.token);
    expect(session.userId).toBe(testUser.id);
  });

  it('should throw UnauthorizedException when email is invalid', async () => {
    await expect(loginUseCase.execute('invalid@example.com', 'password123')).rejects.toThrow('Invalid email or password');
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    await testUser.hashPassword();
    userRepository.users.push(testUser);

    await expect(loginUseCase.execute(testUser.email, 'wrongpassword')).rejects.toThrow('Invalid email or password');
  });
});