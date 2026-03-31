import { getAllObjects } from '../repositories/objectRepository';

export class ObjectType {
  typeId: string;
  typeName: string;
  description: string;

  constructor(typeId: string, typeName: string, description: string) {
    this.typeId = typeId;
    this.typeName = typeName;
    this.description = description;
  }

  getInstances() {
    const allObjects = getAllObjects() as Array<{
      id: string;
      name: string;
      dateAdded: string;
      nfcTag: string | null;
      typeId: string;
      imageUri: string | null;
    }>;

    return allObjects.filter((obj) => obj.typeId === this.typeId);
  }
}