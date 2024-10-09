import { describe, expect, it } from 'vitest';

import { serialize, unserialize } from './json';

describe('json', () => {
  it('should be able to parse json', () => {
    expect(serialize(1)).toEqual(1);
    const json = {
      name: 'John',
      age: 30,
    };
    expect(serialize(json)).toEqual(JSON.stringify({ json }));
    expect(unserialize(serialize(json) as string)).toEqual(json);
  });
});
