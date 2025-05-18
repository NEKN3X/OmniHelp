import { expand } from '../../../chrome-extension/src/helpfeel';
import { getStorageKey, saveExample, storageKey } from '../../../chrome-extension/src/storage';

const registerScrapboxPage = (url: string, key: string) => {};
const registerScrapboxProject = (url: string, key: string) => {
  const m = location.href.match(/scrapbox\.io\/([a-zA-Z0-9\-]+)(\/(.*))?$/);
};
const registerPage = async (url: string, key: string) => {
  const command = window.prompt('Helpfeel記法で説明を入力してください', document.title);
  if (!command) return;
  try {
    const expanded = expand(command);
    console.log('expanded', expanded);
    chrome.storage.local.get(key, items => {
      const values: Suggest[][] = Object.values(items);
      console.log('values', values);
      const other = values.length > 0 ? values[0].filter(v => v.url !== url) : [];
      const data: Suggest[] = [...other, { url, command, expanded: expanded }];
      chrome.storage.local.set({
        [key]: data,
      });
    });
  } catch (e) {
    console.error('Error expanding command', e);
  }
};

export const onClickRegister = async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab[0].url;
  if (!url) return;
  const key = await getStorageKey(url);
  const m = url.match(/scrapbox\.io\/([a-zA-Z0-9\-]+)(\/(.*))?$/);

  // if (m && m[1] && m[3]) registerScrapboxPage(url, key);
  // else if (m && m[1] && !m[3]) registerScrapboxProject(url, key);
  // else registerPage(url, key);
  registerPage(url, key);
};
