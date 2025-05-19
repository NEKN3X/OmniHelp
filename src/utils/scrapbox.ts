export const extractHelpfeel = (lines: string[]): string[] => {
  lines.filter(/^\?\s/.test).map((line) => line.replace(/^\?\s/, ''));
  return lines;
};

export const getHelpfeelFromScrapbox = async (url: string) => {
  const info = scrapboxInfo(url);
  if (!info) return [];
  return fetch(`https://scrapbox.io/api/pages/${info.project}/${info.project}`)
    .then((res) => res.json())
    .then((json) => extractHelpfeel(json.lines || []));
};

export const scrapboxInfo = (url: string) => {
  const m = url.match(/scrapbox\.io\/([a-zA-Z0-9-]+)(\/(.*))?$/);
  if (!m) return null;
  return {
    project: m[1],
    title: m[3],
  };
};
