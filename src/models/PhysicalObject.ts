import { createObject, updateObjectNfc } from '../repositories/objectRepository';
import { getRecordingsByObject } from '../repositories/recordingRepository';

export class PhysicalObject {
  id: string;
  name: string;
  dateAdded: string;
  nfcTag: string | null;
  typeId: string;
  imageUri: string | null;

  constructor(
    id: string,
    name: string,
    dateAdded: string,
    nfcTag: string | null,
    typeId: string,
    imageUri: string | null
  ) {
    this.id = id;
    this.name = name;
    this.dateAdded = dateAdded;
    this.nfcTag = nfcTag;
    this.typeId = typeId;
    this.imageUri = imageUri;
  }

  getNFCTag(): string | null {
    return this.nfcTag;
  }

  getRecordings() {
    return getRecordingsByObject(this.id);
  }

  register(): void {
    if (!this.id || !this.name || !this.dateAdded || !this.typeId) {
      throw new Error('Missing required PhysicalObject fields');
    }

    createObject({
      id: this.id,
      name: this.name,
      dateAdded: this.dateAdded,
      nfcTag: this.nfcTag,
      typeId: this.typeId,
      imageUri: this.imageUri,
    });
  }

  attachNfcTag(tag: string): void {
    if (!tag || !tag.trim()) {
      throw new Error('Invalid NFC tag');
    }

    this.nfcTag = tag;
    updateObjectNfc(this.id, tag);
  }
}