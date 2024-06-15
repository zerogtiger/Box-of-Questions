const { createHash } = require('crypto');

export function hash(text: string) {
  return createHash('sha256').update(text).digest('hex');
}

export function cookieHash(id: number) {
  return hash(((id + Date.now()) * id * 84373602438515515357).toString() + "gwINKKuTf2E5oHfFtwvinEyDpqDmvAnJ");
}
