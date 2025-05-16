import { expect, test } from 'vitest';
import { parse, item, pure, digit } from './expand';

const glossary: Glossary = {
  letter: '(a|b)',
  number: '(1|2)',
};

test('item', () => {
  expect([parse(item)(''), []]);
  expect([parse(item)('abc'), ['a', 'bc']]);
});

test('pure', () => {
  expect([parse(pure(1))('abc'), [[1, 'abc']]]);
});

test('digit', () => {
  expect([parse(digit)('123abc'), ['1', '23abc']]);
});
