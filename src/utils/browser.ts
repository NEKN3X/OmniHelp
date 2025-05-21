export const activeTabs = () =>
  browser.tabs.query({
    active: true,
    currentWindow: true,
  });
