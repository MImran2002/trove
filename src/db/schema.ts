import { db } from './index';

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY NOT NULL,
      passwordHash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS object_types (
      typeId TEXT PRIMARY KEY NOT NULL,
      typeName TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS physical_objects (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      dateAdded TEXT NOT NULL,
      nfcTag TEXT,
      typeId TEXT NOT NULL,
      imageUri TEXT,
      FOREIGN KEY (typeId) REFERENCES object_types(typeId)
    );

    CREATE TABLE IF NOT EXISTS recordings (
      recordingId TEXT PRIMARY KEY NOT NULL,
      objectId TEXT NOT NULL,
      audioUri TEXT,
      imageUri TEXT,
      nfcSnapshot TEXT,
      recordedAt TEXT NOT NULL,
      recordedBy TEXT NOT NULL,
      FOREIGN KEY (objectId) REFERENCES physical_objects(id),
      FOREIGN KEY (recordedBy) REFERENCES users(username)
    );
  `);
}