import { match, P } from 'ts-pattern';

export const extractHelp = (page: string, lines: string[]): Help[] => {
  return lines
    .map((x, i) => ({
      text: x,
      next: i + 1 < lines.length ? lines[i + 1] : undefined,
    }))
    .filter((x) => /^\?\s/.test(x.text))
    .map((x) => {
      const open = match(x.next)
        .with(P.string.regex(/^% (echo|open)\s+(.*)/), (v) =>
          v.replace(/^% (echo|open)\s+/, '')
        )
        .otherwise(() => page);

      return makeHelp(open, x.text.replace(/^\?\s+/, ''), page);
    });
};

export const scrapboxInfo = (url: string) => {
  const m = url.match(/scrapbox\.io\/([a-zA-Z0-9-]+)(\/(.*))?$/);
  if (!m) return undefined;
  return {
    project: m[1],
    title: m[3],
  };
};

export const extractGlossary = (page: string, lines: string[]): Glossary => {
  const glossary = lines.filter((x) => /^(.*):\s*`(.*)`/.test(x));
  const data: Glossary = new Map();
  glossary.forEach((x) => {
    const m = x.match(/^(.*):\s*`(.*)`/);
    if (!m || !m[0] || !m[1] || !m[2]) return;
    data.set(m[1], m[2]);
  });
  return data;
};
