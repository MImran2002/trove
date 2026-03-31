import * as Crypto from 'expo-crypto';
import { createUser, findUser } from '../repositories/userRepository';

export class User {
  username: string;
  passwordSequence: string;

  constructor(username: string, passwordSequence: string) {
    this.username = username;
    this.passwordSequence = passwordSequence;
  }

  async login(): Promise<boolean> {
    const existing = findUser(this.username) as { username: string; passwordHash: string } | null;

    if (!existing) {
      return false;
    }

    const hashedInput = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      this.passwordSequence
    );

    return hashedInput === existing.passwordHash;
  }

  logout(): void {
    console.log(`${this.username} logged out`);
  }

  async signUp(): Promise<void> {
    const existing = findUser(this.username);

    if (existing) {
      throw new Error('Username already taken');
    }

    const hashedPwd = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      this.passwordSequence
    );

    createUser(this.username, hashedPwd);
  }

  tapDoodleSequence(): string {
    return this.passwordSequence;
  }
}