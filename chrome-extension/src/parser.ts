import { match, P } from 'ts-pattern';

type Parser<T> = (input: string) => [T, string][];

export const parse = <T>(parser: Parser<T>) => {
  return (input: string) => parser(input);
};

export const item: Parser<string> = input =>
  match(input)
    .with('', _ => [])
    .otherwise(() => [[input[0], input.slice(1)]]);

export const fmap = <A, B>(f: (x: A) => B, parser: Parser<A>): Parser<B> => {
  return input => parser(input).map(([x, rest]) => [f(x), rest]);
};

export const pure = <T>(x: T): Parser<T> => {
  return input => [[x, input]];
};

export const ap = <A, B>(pg: Parser<(x: A) => B>, px: Parser<A>): Parser<B> => {
  return input =>
    match(parse(pg)(input))
      .with([], () => [])
      .otherwise(([[g, out]]) => parse(fmap(g, px))(out));
};

export const bind = <A, B>(p: Parser<A>, f: (x: A) => Parser<B>): Parser<B> => {
  return input =>
    match(parse(p)(input))
      .with([], () => [])
      .otherwise(([[v, out]]) => parse(f(v))(out));
};

export const empty: Parser<never> = _ => [];
export const orElse = <A>(a: Parser<A>, b: Parser<A>): Parser<A> => {
  return input =>
    match(a(input))
      .with([], _ => b(input))
      .otherwise(v => v);
};

// predicateを満たす1文字用のパーサー
export const sat = (predicate: (x: string) => boolean): Parser<string> => {
  return bind(item, x => (predicate(x) ? pure(x) : empty));
};

export const char = (x: string) => sat(y => x === y);

export const str = (s: string): Parser<string> => {
  return match(s)
    .with('', () => pure(s))
    .otherwise(() => bind(char(s[0]), () => bind(str(s.slice(1)), () => pure(s))));
};

export const many = <T>(parser: Parser<T>): Parser<T[]> => {
  return orElse(some(parser), pure([]));
};

const defer = <T>(factory: () => Parser<T>): Parser<T> => {
  return input => factory()(input);
};
export const some = <T>(parser: Parser<T>): Parser<T[]> => {
  return ap(
    ap(
      pure((x: T) => (xs: T[]) => [x, ...xs]),
      parser,
    ),
    defer(() => many(parser)),
  );
};
