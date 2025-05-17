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
  return input => {
    return parser(input).map(([x, rest]) => [f(x), rest]);
  };
};

export const pure = <T>(x: T): Parser<T> => {
  return input => {
    return [[x, input]];
  };
};

export const ap = <A, B>(f: Parser<(x: A) => B>, pa: Parser<A>): Parser<B> => {
  return input => {
    const result = parse(f)(input);
    return result.flatMap(([g, out]) => {
      const p = fmap(g, pa);
      return p(out);
    });
  };
};

export const bind = <A, B>(pa: Parser<A>, f: (x: A) => Parser<B>): Parser<B> => {
  return input => {
    const result = pa(input);
    return result.flatMap(([v, out]) => {
      return f(v)(out);
    });
  };
};

export const empty: Parser<never> = _ => [];
export const orElse =
  <A>(a: Parser<A>, b: Parser<A>): Parser<A> =>
  input => {
    const aResult = a(input);
    switch (aResult.length) {
      case 0:
        return b(input);
      default:
        return aResult;
    }
  };

export const sat =
  (predicate: (x: string) => boolean): Parser<string> =>
  input => {
    if (predicate(input[0])) {
      return [[input[0], input.slice(1)]];
    } else {
      return [];
    }
  };

export const char = (x: string) => sat(y => x === y);

export const str = (s: string): Parser<string> => {
  switch (s.length) {
    case 0:
      return pure(s);
    default:
      return bind(char(s[0]), () => bind(str(s.slice(1)), () => pure(s)));
  }
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
