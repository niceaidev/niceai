// @ts-expect-error
import SuperJSON from 'superjson';
import _isNaN from 'lodash/isNaN';
import _toNumber from 'lodash/toNumber';

const isNumber = (value: unknown) => !_isNaN(_toNumber(value));

/**
 * Unserialize the value.
 *
 * This function takes a string representation of a serialized value, and returns the unserialized data.
 * If the input string is empty or null, the function returns null.
 *
 * @param value The serialized data string.
 * @returns The unserialized data, or null if the input is invalid.
 */
export function unserialize<T>(value: string): T | null {
  return isNumber(value) ? (_toNumber(value) as T) : SuperJSON.parse<T>(value);
}

/**
 * Serialize the value.
 *
 * @param value - The value to be serialized, with a type of unknown, can be any type of data.
 * @returns Returns the serialized string.
 */
export function serialize(value: unknown): string | number {
  return isNumber(value) && !_isNaN(value)
    ? (value as number)
    : SuperJSON.stringify(value);
}
