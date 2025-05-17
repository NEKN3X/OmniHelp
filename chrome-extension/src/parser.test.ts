import { expect, test } from 'vitest';
import { ap, bind, char, empty, fmap, item, many, orElse, parse, pure, sat, some, str } from './parser';

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
  expect(result('')).toEqual([[1, '']]);
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
  expect(result('')).toEqual([]);
});

test('three2', () => {
  const result = parse(three2);
  expect(result('abcdef')).toEqual([[['a', 'c'], 'def']]);
  expect(result('ab')).toEqual([]);
  expect(result('')).toEqual([]);
});

test('empty', () => {
  const result = parse(empty);
  expect(result('abc')).toEqual([]);
});

test('orElse', () => {
  const result = parse(orElse(item, pure('d')));
  expect(result('abc')).toEqual([['a', 'bc']]);
  expect(result('')).toEqual([['d', '']]);
  const result2 = parse(orElse(empty, pure('d')));
  expect(result2('abc')).toEqual([['d', 'abc']]);
  expect(result('')).toEqual([['d', '']]);
});

const digit = sat(x => /\d/.test(x));

test('digit', () => {
  const result = parse(digit);
  expect(result('123abc')).toEqual([['1', '23abc']]);
  expect(result('')).toEqual([]);
});

test('char', () => {
  const result = parse(char('a'));
  expect(result('abc')).toEqual([['a', 'bc']]);
  expect(result('bcd')).toEqual([]);
  expect(result('')).toEqual([]);
});

test('str', () => {
  const result = parse(str('abc'));
  expect(result('abcdef')).toEqual([['abc', 'def']]);
  expect(result('ab1234')).toEqual([]);
  expect(result('')).toEqual([]);
});

test('many', () => {
  const result = parse(many(digit));
  expect(result('123abc')).toEqual([[['1', '2', '3'], 'abc']]);
  expect(result('abc')).toEqual([[[], 'abc']]);
  expect(result('')).toEqual([[[], '']]);
});

test('some', () => {
  const result = parse(some(digit));
  expect(result('123abc')).toEqual([[['1', '2', '3'], 'abc']]);
  expect(result('abc')).toEqual([]);
  expect(result('')).toEqual([]);
});

const isSpace = (x: string) => /\s/.test(x);
const space = bind(many(sat(isSpace)), () => pure(null));
test('space', () => {
  const result = parse(space);
  expect(result('   abc')).toEqual([[null, 'abc']]);
  expect(result('abc')).toEqual([[null, 'abc']]);
  expect(result('')).toEqual([[null, '']]);
});

const nat = bind(some(digit), (xs: string[]) => pure(parseInt(xs.join(''), 10)));
test('nat', () => {
  const result = parse(nat);
  expect(result('123abc')).toEqual([[123, 'abc']]);
  expect(result('123 abc')).toEqual([[123, ' abc']]);
  expect(result('abc')).toEqual([]);
  expect(result('')).toEqual([]);
});

const int = orElse(
  bind(char('-'), () => bind(nat, (n: number) => pure(-n))),
  nat,
);
test('int', () => {
  const result = parse(int);
  expect(result('123abc')).toEqual([[123, 'abc']]);
  expect(result('-123abc')).toEqual([[-123, 'abc']]);
  expect(result('abc')).toEqual([]);
  expect(result('')).toEqual([]);
});
