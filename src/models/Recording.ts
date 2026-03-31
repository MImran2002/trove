import { createRecording } from '../repositories/recordingRepository';

export class Recording {
  recordingId: string;
  objectId: string;
  audioUri: string | null;
  imageUri: string | null;
  nfcSnapshot: string | null;
  recordedAt: string;
  recordedBy: string;

  constructor(
    recordingId: string,
    objectId: string,
    audioUri: string | null,
    imageUri: string | null,
    nfcSnapshot: string | null,
    recordedAt: string,
    recordedBy: string
  ) {
    this.recordingId = recordingId;
    this.objectId = objectId;
    this.audioUri = audioUri;
    this.imageUri = imageUri;
    this.nfcSnapshot = nfcSnapshot;
    this.recordedAt = recordedAt;
    this.recordedBy = recordedBy;
  }

  record(): void {
    console.log('Recording logic will be connected to expo-audio later');
  }

  playback(): void {
    if (!this.audioUri) {
      throw new Error('No audio available for playback');
    }

    console.log(`Playback audio from ${this.audioUri}`);
  }

  save(): void {
    if (!this.recordingId || !this.objectId || !this.recordedAt || !this.recordedBy) {
      throw new Error('Missing required Recording fields');
    }

    createRecording({
      recordingId: this.recordingId,
      objectId: this.objectId,
      audioUri: this.audioUri,
      imageUri: this.imageUri,
      nfcSnapshot: this.nfcSnapshot,
      recordedAt: this.recordedAt,
      recordedBy: this.recordedBy,
    });
  }
}