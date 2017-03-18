/**
 * Returns a 32-bit hash value hash function for 
 * String. Inspired by Java source.
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

/**
 * Returns the file extension part or an empty string 
 * if there is none.
 */
export function getFileExtension(filename: string): string {
  if (!filename)
    return;
  let ext = '', temp = '';
  for (let i = filename.length - 1; i >= 0; --i) {
    let char = filename[i];
    if (char === '.') {
      ext = temp; // avoid filename without extension
      break;
    }
    temp = char + temp;
  }
  return ext;
}

/**
 * Returns the folder name part of a file path.
 * @param path  The file path.
 */
export function getFolderName(path: string): string {
  if (!path)
    return;
  // Remove the last dash (/)
  if(path[path.length - 1] === '\\' || path[path.length - 1] === '/')
    path = path.substr(0, path.length - 1);
    
  let ext = '', temp = '';
  for (let i = path.length - 1; i >= 0; --i) {
    let char = path[i];
    if (char === '/' || char === '\\') {
      ext = temp;
      break;
    }
    temp = char + temp;
  }
  return ext;
}

/**
 * Returns true if the string starts with one of the 
 * prefixes and false otherwise.
 * @param str       String to be checked.
 * @param prefixes  A list of prefixes.
 */
export function startsWithOne(str: string, prefixes: string[]): boolean {
  for (let p of prefixes) {
    if (/\w/.test(p[0]))
      p = '\\b' + p;
    if (/\w/.test(p.slice(-1)))
      p = p + '\\b';
    if ((new RegExp('^' + p, 'i')).test(str))
      return true;
  }
  return false;
}
