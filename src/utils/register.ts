export const unregister = async () => {};

export const registerScrapbox = async (
  url: string,
  commands: string[],
  page: string
) => {
  if (url === '' || commands.length === 0) return;

  try {
    await setScrapboxHelp(url, commands, page);
  } catch (e) {
    console.error('Error expanding command', e);
  }
};

export const register = async (url: string, command: string) => {
  if (url === '' || command === '') return;

  try {
    await addHelpPage(url, command);
  } catch (e) {
    console.error('Error expanding command', e);
  }
};
