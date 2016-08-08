/**
 * Hash function for String. Inspired by Java source.
 * @returns {number} A 32-bit hash value.
 */
export function hashCode(str: string): number {
  let hash = 0;
  if(str.length == 0)
    return hash;
  for(let i = 0; i < str.length; ++i) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // force convert to 32-bit int
  }
  return hash;
}