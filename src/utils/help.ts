import { expand } from './parser/helpfeel';

export const makeHelp = (
  url: string,
  command: string,
  page?: string
): Help => ({
  url,
  command,
  expanded: expand(command),
  page,
});

export const exampleUrl = 'https://wxt.dev/guide/essentials/unit-testing.html';
export const exampleHelps: Help[] = [
  makeHelp(exampleUrl, 'example: wxtに関する説明'),
  makeHelp(exampleUrl, 'example: wxtの(|ユニット)テストに関する説明'),
];
