import { expect, test } from 'vitest';
import { expand } from './helpfeel';

test('expand', () => {
  expect(expand('abc')).toEqual(['abc']);
});
