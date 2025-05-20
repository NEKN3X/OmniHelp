export default defineContentScript({
  registration: 'runtime',
  main() {
    const url = location.href;
    const info = scrapboxInfo(url);
    if (!info) return;
    console.log('scrapbox', info);

    return fetch(`https://scrapbox.io/api/pages/${info.project}/Glossary`)
      .then((res) => res.json())
      .then((json) => {
        return json.lines;
      });
  },
});
