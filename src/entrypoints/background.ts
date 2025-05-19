import { search } from '@/utils/search';
import { helpData } from '@/utils/storage';

export default defineBackground(() => {
  browser.omnibox.onInputChanged.addListener(async (text, suggest) => {
    const data = Object.values(await helpData.getValue())
      .flat()
      .flatMap((x) =>
        x.expanded.map((y) => ({
          content: x.url,
          description: y,
        }))
      );
    const result = search(data, text);
    suggest(result);
  });

  browser.omnibox.onInputEntered.addListener((text, dis) => {
    if (text.match(/^http/)) {
      switch (dis) {
        case 'currentTab':
          browser.tabs.update({ url: text });
          break;
        case 'newForegroundTab':
          browser.tabs.create({ url: text });
          break;
        case 'newBackgroundTab':
          browser.tabs.create({ url: text, active: false });
          break;
      }
    } else {
      const disposition: Browser.search.Disposition =
        dis === 'currentTab' ? 'CURRENT_TAB' : 'NEW_TAB';
      browser.search.query({ text: text, disposition });
    }
  });
});
