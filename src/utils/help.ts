import { expand } from './parser/helpfeel';

export const isScrapboxHelp = (help: Help): help is ScrapboxHelp =>
  help.page !== undefined;
export const isNormalHelp = (help: Help): help is NormalHelp =>
  help.page === undefined;

export const makeHelp = (
  open: string,
  command: string,
  page?: string
): Help => ({
  open,
  command,
  expanded: expand(command),
  ...(page ? { page } : {}),
});

const helpData = storage.defineItem<Help[]>('local:help', {
  fallback: [],
});

export const getAllHelps = helpData.getValue;
export const watchHelps = helpData.watch;

export const registerHelp = async (helps: Help[]) => {
  const data = await helpData.getValue();
  const normalHelps = helps.filter(isNormalHelp);
  const scrapboxHelps = helps.filter(isScrapboxHelp);
  const pages = new Set(scrapboxHelps.map((x) => x.page));
  const newData = [
    ...data.filter(
      (x) =>
        (isNormalHelp(x) &&
          !normalHelps.some(
            (y) => y.open === x.open && y.command === x.command
          )) ||
        (isScrapboxHelp(x) && !pages.has(x.page))
    ),
    ...normalHelps,
    ...scrapboxHelps,
  ];

  helpData.setValue(newData);
};

export const unregisterHelp = async (
  open: string,
  command: string,
  page?: string
) => {
  const data = await helpData.getValue();
  helpData.setValue(
    data.filter(
      (x) => !(x.open === open && x.command === command && x.page === page)
    )
  );
};

export const unregisterScrapboxHelp = async (page: string) => {
  const data = await helpData.getValue();
  helpData.setValue(
    data.filter((x) => !(isScrapboxHelp(x) && x.page === page))
  );
};
