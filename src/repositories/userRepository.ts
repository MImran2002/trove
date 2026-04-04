import { db } from '../db';

export function createUser(username: string, passwordHash: string) {
  db.runSync(
    `INSERT INTO users (username, passwordHash) VALUES (?, ?)`,
    [username, passwordHash]
  );
}

export function findUser(username: string) {
  return db.getFirstSync(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
}

export function getFirstUser() {
  return db.getFirstSync(`SELECT * FROM users LIMIT 1`);
}

export function hasRegisteredUser() {
  const user = db.getFirstSync(`SELECT username FROM users LIMIT 1`);
  return !!user;
}