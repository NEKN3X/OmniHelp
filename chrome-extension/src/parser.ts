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

export const ap = <A, B>(f: Parser<(x: A) => B>, pa: Parser<A>): Parser<B> => {
  return input => parse(f)(input).flatMap(([g, out]) => fmap(g, pa)(out));
};

export const bind = <A, B>(pa: Parser<A>, f: (x: A) => Parser<B>): Parser<B> => {
  return input => pa(input).flatMap(([v, out]) => f(v)(out));
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

const maybe =
  <T>(a: Parser<T>, b: Parser<T>): Parser<T> =>
  input => {
    const aResult = a(input);
    switch (aResult.length) {
      case 0:
        return b(input);
      default:
        return aResult;
    }
  };

// export const many = <T>(parser: Parser<T>): Parser<T[]> => {
//   return maybe(some(parser), pure([]));
// };
