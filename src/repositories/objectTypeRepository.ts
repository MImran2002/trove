import { db } from '../db';

export function getAllTypes() {
  return db.getAllSync(`SELECT * FROM object_types`);
}