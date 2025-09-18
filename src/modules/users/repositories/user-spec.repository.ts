import { User } from '@/modules/users/entities/user.entity';
import { IUserRepository } from './user.repository';

export class UserRepositorySpec implements IUserRepository {
  public users: User[] = [];

  create(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }

  update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.deletedAt = new Date();
    }
    return Promise.resolve();
  }

  async activate(id: string): Promise<void> {
    const user = await this.findByIdWithDeleted(id);
    if (user) {
      user.deletedAt = null;
    }
    return Promise.resolve();
  }

  find(): Promise<User[]> {
    return Promise.resolve(this.users.filter((user) => !user.deletedAt));
  }

  findWithDeleted(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  findById(id: string): Promise<User> {
    return Promise.resolve(
      this.users.find((user) => user.id === id && !user.deletedAt),
    );
  }

  findByIdWithDeleted(id: string): Promise<User> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }

  findByEmail(email: string): Promise<User> {
    return Promise.resolve(
      this.users.find((user) => user.email === email && !user.deletedAt),
    );
  }
}
