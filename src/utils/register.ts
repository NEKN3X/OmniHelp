import { expand } from './parser/helpfeel';

export const unregister = async () => {};

const registerScrapboxPage = () => {};
const registerScrapboxProject = () => {
  const m = location.href.match(/scrapbox\.io\/([a-zA-Z0-9\-]+)(\/(.*))?$/);
};
const registerPage = async () => {
  const command = window.prompt(
    'Helpfeel記法で説明を入力してください',
    document.title
  );
  if (!command) return;
  try {
    const expanded = expand(command);
    console.log('expanded', expanded);
    // browser.storage.local.get(key, (items) => {
    //   const values: Help[][] = Object.values(items);
    //   console.log('values', values);
    //   const other =
    //     values.length > 0 ? values[0].filter((v) => v.url !== url) : [];
    //   const data: Help[] = [...other, { url, command, expanded: expanded }];
    //   browser.storage.local.set({
    //     [key]: data,
    //   });
    // });
  } catch (e) {
    console.error('Error expanding command', e);
  }
};

export const register = async (url: string) => {
  const m = url.match(/scrapbox\.io\/([a-zA-Z0-9\-]+)(\/(.*))?$/);

  if (m && m[1] && m[3]) registerScrapboxPage();
  else if (m && m[1] && !m[3]) registerScrapboxProject();
  else registerPage();
};
