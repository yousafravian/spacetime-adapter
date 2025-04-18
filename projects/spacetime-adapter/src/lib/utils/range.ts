/**
 * Creates an array and fills it with values from a generator function.
 * @param length The length of the array to create.
 * @param valueFunction Function that returns the value for a given index.
 * @returns The filled array.
 */
export function range<T>( length: number, valueFunction: ( index: number ) => T ): T[] {
  const valuesArray = Array( length );
  for ( let i = 0; i < length; i++ ) {
    valuesArray[ i ] = valueFunction( i );
  }
  return valuesArray;
} 