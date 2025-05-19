export const helpData = storage.defineItem<Help[]>('local:help', {
  fallback: [],
});

export const saveExampleHelp = async () => {
  helpData.setValue(exampleHelps);
};

export const addHelpPage = async (
  url: string,
  command: string,
  page?: string
) => {
  const help = makeHelp(url, command, page);
  const data = await helpData.getValue();
  helpData.setValue([
    ...data.filter(
      (x) => x.url !== url || (x.url === url && x.command !== command)
    ),
    help,
  ]);
};

export const setScrapboxHelp = async (
  url: string,
  commands: string[],
  page: string
) => {
  const helps = commands.map((x) => makeHelp(url, x, page));
  const data = await helpData.getValue();
  helpData.setValue([...data.filter((x) => x.page !== page), ...helps]);
};
export const removeScrapboxHelp = async (page: string) => {
  const data = await helpData.getValue();
  helpData.setValue(data.filter((x) => x.page !== page));
};

export const removeHelp = async (url: string, command: string) => {
  const data = await helpData.getValue();
  helpData.setValue(
    data.filter(
      (x) => x.url !== url || (x.url === url && x.command !== command)
    )
  );
};
