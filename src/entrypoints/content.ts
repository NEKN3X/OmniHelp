export default defineContentScript({
  matches: ['*://scrapbox.io/*'],
  main(ctx) {
    console.log('Hello from content script!');
    browser.runtime
      .connect({ name: 'OmniHelp' })
      .onMessage.addListener((message) => {
        if (message.type === 'scrapbox') {
          console.log('Received message from background:', message);
        }
      });
  },
});
