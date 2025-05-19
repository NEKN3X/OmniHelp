export const unregister = async () => {};

const registerScrapboxPage = () => {};
const registerScrapboxProject = () => {};
const registerPage = async (url: string, command: string) => {
  try {
    await addHelp(url, command);
  } catch (e) {
    console.error('Error expanding command', e);
  }
};

export const register = async (url: string, command: string) => {
  if (url === '' || command === '') return;
  const m = url.match(/scrapbox\.io\/([a-zA-Z0-9-]+)(\/(.*))?$/);
  console.log('register', url, command);
  console.log('m', m);

  if (m && m[1] && m[3]) registerScrapboxPage();
  else if (m && m[1] && !m[3]) registerScrapboxProject();
  else registerPage(url, command);
};
