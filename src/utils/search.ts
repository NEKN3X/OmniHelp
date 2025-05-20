import Fuse from 'fuse.js';

type SuggestResults = Browser.omnibox.SuggestResult[];
export const search = (data: SuggestResults, text: string): SuggestResults => {
  const fuse = new Fuse(data, { keys: ['description'] });
  return fuse.search(text).map((i) => i.item);
};
