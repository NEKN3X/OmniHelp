import { expect, test } from 'vitest';
import { ap, bind, char, empty, fmap, item, orElse, parse, pure, sat, str } from './parser';

const glossary: Glossary = {
  letter: '(a|b)',
  number: '(1|2)',
};

test('item', () => {
  const result = parse(item);
  expect(result('')).toEqual([]);
  expect(result('a')).toEqual([['a', '']]);
  expect(result('abc')).toEqual([['a', 'bc']]);
});

const toUpper = (x: string) => x.toUpperCase();

test('fmap', () => {
  const result = parse(fmap(toUpper, item));
  expect(result('abc')).toEqual([['A', 'bc']]);
  expect(result('')).toEqual([]);
});

test('pure', () => {
  const result = parse(pure(1));
  expect(result('abc')).toEqual([[1, 'abc']]);
});

const three = ap(
  ap(
    ap(
      pure((x: string) => (_: string) => (z: string) => [x, z]),
      item,
    ),
    item,
  ),
  item,
);

const three2 = bind(item, (x: string) =>
  bind(item, (y: string) =>
    bind(item, (z: string) => {
      return pure([x, z]);
    }),
  ),
);

test('three', () => {
  const result = parse(three);
  expect(result('abcdef')).toEqual([[['a', 'c'], 'def']]);
  expect(result('ab')).toEqual([]);
});

test('three2', () => {
  const result = parse(three2);
  expect(result('abcdef')).toEqual([[['a', 'c'], 'def']]);
  expect(result('ab')).toEqual([]);
});

test('empty', () => {
  const result = parse(empty);
  expect(result('abc')).toEqual([]);
});

test('orElse', () => {
  const result = parse(orElse(item, pure('d')));
  expect(result('abc')).toEqual([['a', 'bc']]);
  const result2 = parse(orElse(empty, pure('d')));
  expect(result2('abc')).toEqual([['d', 'abc']]);
});

const digit = sat(x => /\d/.test(x));

test('digit', () => {
  const result = parse(digit);
  expect(result('123abc')).toEqual([['1', '23abc']]);
});

test('char', () => {
  const result = parse(char('a'));
  expect(result('abc')).toEqual([['a', 'bc']]);
  expect(result('bcd')).toEqual([]);
});

test('str', () => {
  const result = parse(str('abc'));
  expect(result('abcdef')).toEqual([['abc', 'def']]);
  expect(result('ab1234')).toEqual([]);
});
