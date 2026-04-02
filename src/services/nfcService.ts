import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { findObjectById, updateObjectNfc } from '../repositories/objectRepository';

let nfcStarted = false;

export class NFCScanner {
  async init(): Promise<boolean> {
    const supported = await NfcManager.isSupported();
    if (!supported) return false;

    if (!nfcStarted) {
      await NfcManager.start();
      nfcStarted = true;
    }

    return true;
  }

  async scan(): Promise<string> {
    const supported = await this.init();

    if (!supported) {
      throw new Error('NFC is not supported on this device');
    }

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      // Prefer the hardware UID if available
      const tagId = tag?.id;

      if (!tagId) {
        throw new Error('No NFC tag ID found');
      }

      return tagId;
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch {
        // ignore cleanup errors
      }
    }
  }

  validate(tag: string): boolean {
    return !!tag && tag.trim().length >= 3;
  }

  async bind(objectId: string): Promise<string> {
    const obj = await findObjectById(objectId);

    if (!obj) {
      throw new Error('Object not found');
    }

    const tag = await this.scan();

    if (!this.validate(tag)) {
      throw new Error('Invalid NFC tag');
    }

    await updateObjectNfc(objectId, tag);
    return tag;
  }
}