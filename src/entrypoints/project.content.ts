export default defineContentScript({
  registration: 'runtime',
  main() {
    const url = location.href;
    const info = scrapboxInfo(url);
    if (!info) return;
    console.log('scrapbox', info);

    if (info.project !== '') {
      return fetch(`https://scrapbox.io/api/pages/${info.project}`)
        .then((res) => res.json())
        .then((json) => {
          console.log('json', json);
          return json.pages;
        });
    }
  },
});
