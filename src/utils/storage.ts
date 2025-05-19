import { storage } from '#imports';

export const helpData = storage.defineItem<Help[]>('local:help', {
  fallback: [],
});

export const saveExampleHelp = async () => {
  helpData.setValue(exampleHelps);
};
