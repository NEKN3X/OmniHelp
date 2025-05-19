export const helpData = storage.defineItem<Help[]>('local:help', {
  fallback: [],
});

export const saveExampleHelp = async () => {
  helpData.setValue(exampleHelps);
};

export const addHelp = async (url: string, command: string) => {
  const help = makeHelp(url, command);
  const data = await helpData.getValue();
  helpData.setValue([
    ...data.filter(
      (x) => x.url !== url || (x.url === url && x.command !== command)
    ),
    help,
  ]);
};

export const removeHelp = async (url: string, command: string) => {
  const data = await helpData.getValue();
  helpData.setValue(
    data.filter(
      (x) => x.url !== url || (x.url === url && x.command !== command)
    )
  );
};
