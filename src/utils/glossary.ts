import { expand } from './parser/helpfeel';

const glossaryData = storage.defineItem<[string, string][]>('local:glossary', {
  fallback: [],
});

export const getGlossary = async () => {
  const data = await glossaryData.getValue();
  return new Map(data);
};
export const registerGlossary = async (value: Glossary) => {
  const data = Array.from(value.entries());
  await glossaryData.setValue(data);
  return data;
};

export const expandWithGlossary = async (text: string) => {
  const glossary = await getGlossary();
  const m = text.match(/{.*}/);
  if (!m) return expand(text);
  let command = text;
  while (/{.*?}/.test(command)) {
    command = command.replace(/{(.*?)}/, (match, text: string) => {
      const value = glossary.get(text);
      if (!value) return text;
      return value;
    });
  }
  return expand(command);
};

export const updateHelpsWithGlossary = async () => {
  const data = await getAllHelps();
  const newData = await Promise.all(
    data.map(async (x) => ({
      ...x,
      expanded: await expandWithGlossary(x.command),
    }))
  );
  await helpData.setValue(newData);
};
