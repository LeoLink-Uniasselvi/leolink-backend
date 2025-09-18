import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';

@Injectable()
export class PasswordHashingService {
  private readonly DEFAULT_OPTIONS = {
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 iterations
    outputLen: 32, // 32 bytes output
    parallelism: 1, // 1 thread
  };

  /**
   * Hash a password using Argon2id with automatic salt generation
   * Argon2 automatically generates a unique salt for each password
   * @param password - The plain text password to hash
   * @returns Promise<string> - The hashed password with embedded salt
   */
  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.DEFAULT_OPTIONS);
  }

  /**
   * Verify a password against its hash
   * The salt is automatically extracted from the hash by Argon2
   * @param password - The plain text password
   * @param hashedPassword - The hashed password to compare against
   * @returns Promise<boolean> - True if password matches, false otherwise
   */
  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await verify(hashedPassword, password);
    } catch {
      return false;
    }
  }
}
