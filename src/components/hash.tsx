const { createHash } = require('crypto');

export function hash(text: string) {
  return createHash('sha256').update(text).digest('hex');
}

