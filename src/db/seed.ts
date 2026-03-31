import { db } from './index';

export function seedObjectTypes() {
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM object_types'
  );

  if (result && result.count > 0) {
    return;
  }

  db.runSync(
    `
    INSERT INTO object_types (typeId, typeName, description)
    VALUES
      (?, ?, ?),
      (?, ?, ?),
      (?, ?, ?)
    `,
    [
      'artifact', 'Artifact', 'Historic or meaningful physical artifact',
      'tool', 'Tool', 'Functional physical tool or device',
      'memory', 'Memory Item', 'An item connected to personal stories or memories',
    ]
  );
}