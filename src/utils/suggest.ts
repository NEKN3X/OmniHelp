import { expand } from './parser/helpfeel';

export const makeSuggest = (url: string, command: string): Suggest => ({
  url,
  command,
  expanded: expand(command),
});

export const exampleUrl = 'https://wxt.dev/guide/essentials/unit-testing.html';
export const exampleSuggests: Suggest[] = [
  makeSuggest(exampleUrl, 'example: wxtに関する説明'),
  makeSuggest(exampleUrl, 'example: wxtの(|ユニット)テストに関する説明'),
];
