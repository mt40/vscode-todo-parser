/**
 * Return equal parts of an array
 * @template T
 * @param array     An array to be sliced.
 * @param chunkSize Size of each part.
 */
export function sliceArray<T>(array: T[], chunkSize: number): Array<T[]> {
  let slices = [];
  if(chunkSize == 0)
    return slices;
  for (let i = 0; i < array.length; i += chunkSize) {
    slices.push(array.slice(i, i + chunkSize));
  }
  return slices;
}