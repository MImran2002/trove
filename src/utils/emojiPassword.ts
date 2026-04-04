export const EMOJI_OPTIONS = ['🧸', '🌙', '⭐', '🍎', '🔔', '🎈', '🦋', '🍀'];

export function serializeEmojiSequence(sequence: string[]) {
  return sequence.join('|');
}

export function deserializeEmojiSequence(value: string) {
  if (!value) return [];
  return value.split('|').filter(Boolean);
}

export function sequencesMatch(a: string[], b: string[]) {
  if (a.length !== b.length) return false;

  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) {
      return false;
    }
  }

  return true;
}