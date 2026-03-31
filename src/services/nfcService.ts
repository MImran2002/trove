import { findObjectById, updateObjectNfc } from '../repositories/objectRepository';

export class NFCScanner {
  async scan(): Promise<string> {
    console.log('NFC scan triggered');
    return 'mock-nfc-tag-001';
  }

  validate(tag: string): boolean {
    if (!tag || tag.trim().length < 3) {
      return false;
    }

    return true;
  }

  async bind(objectId: string): Promise<void> {
    const obj = findObjectById(objectId);

    if (!obj) {
      throw new Error('Object not found');
    }

    const tag = await this.scan();

    if (!this.validate(tag)) {
      throw new Error('Invalid NFC tag');
    }

    updateObjectNfc(objectId, tag);
  }
}