import { db } from '../db';

export function createRecording(recording: {
  recordingId: string;
  objectId: string;
  audioUri: string | null;
  imageUri: string | null;
  nfcSnapshot: string | null;
  recordedAt: string;
  recordedBy: string;
}) {
  db.runSync(
    `INSERT INTO recordings
     (recordingId, objectId, audioUri, imageUri, nfcSnapshot, recordedAt, recordedBy)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      recording.recordingId,
      recording.objectId,
      recording.audioUri,
      recording.imageUri,
      recording.nfcSnapshot,
      recording.recordedAt,
      recording.recordedBy,
    ]
  );
}

export function getRecordingsByObject(objectId: string) {
  return db.getAllSync(
    `SELECT * FROM recordings
     WHERE objectId = ?
     ORDER BY recordedAt DESC`,
    [objectId]
  );
}

export function getLatestRecordingByObject(objectId: string) {
  return db.getFirstSync(
    `SELECT * FROM recordings
     WHERE objectId = ?
     ORDER BY recordedAt DESC
     LIMIT 1`,
    [objectId]
  );
}