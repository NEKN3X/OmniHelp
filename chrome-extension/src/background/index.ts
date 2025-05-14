import 'webextension-polyfill';
import Fuse from 'fuse.js';

const suggests: Suggest[] = [
  {
    command: 'xyzに関する説明',
    url: 'https://scrapbox.io/nekn3x/xyz',
  },
  {
    command: 'xyzに関する説明2',
    url: 'https://scrapbox.io/nekn3x/abc',
  },
  {
    command: '123に関する説明',
    url: 'https://scrapbox.io/nekn3x/123',
  },
];
chrome.storage.local.set({ suggests0: suggests }, function () {});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.storage.local.get(null, v => {
    const values: Suggest[][] = Object.values(v);
    const fuse = new Fuse(values.flat(), { keys: ['command'] });
    const result = fuse.search(text).map(i => ({
      content: i.item.url,
      description: i.item.command,
    }));
    suggest(result);
  });
});

chrome.omnibox.onInputEntered.addListener((text, dis) => {
  if (text.match(/^http/)) {
    switch (dis) {
      case 'currentTab':
        chrome.tabs.update({ url: text });
        break;
      case 'newForegroundTab':
        chrome.tabs.create({ url: text });
        break;
      case 'newBackgroundTab':
        chrome.tabs.create({ url: text, active: false });
        break;
    }
  } else {
    const disposition: chrome.search.Disposition = dis === 'currentTab' ? 'CURRENT_TAB' : 'NEW_TAB';
    chrome.search.query({ text: text, disposition });
  }
});
