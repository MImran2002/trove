import { db } from '../db';

export function createObject(object: {
  id: string;
  name: string;
  dateAdded: string;
  nfcTag: string | null;
  typeId: string;
  imageUri: string | null;
}) {
  db.runSync(
    `INSERT INTO physical_objects
     (id, name, dateAdded, nfcTag, typeId, imageUri)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      object.id,
      object.name,
      object.dateAdded,
      object.nfcTag,
      object.typeId,
      object.imageUri,
    ]
  );
}

export function getAllObjects() {
  return db.getAllSync(`SELECT * FROM physical_objects`);
}

export function findObjectById(id: string) {
  return db.getFirstSync(
    `SELECT * FROM physical_objects WHERE id = ?`,
    [id]
  );
}

export function findObjectByNfcTag(tag: string) {
  return db.getFirstSync(
    `SELECT * FROM physical_objects WHERE nfcTag = ?`,
    [tag]
  );
}

export function updateObjectNfc(id: string, tag: string) {
  db.runSync(
    `UPDATE physical_objects SET nfcTag = ? WHERE id = ?`,
    [tag, id]
  );
}