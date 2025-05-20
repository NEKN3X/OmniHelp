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
