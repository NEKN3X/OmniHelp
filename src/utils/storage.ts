import { exampleSuggests, exampleUrl } from './suggest';

// 文字列を0~255の整数に変換する
export const hash = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message); // (utf-8 の) Uint8Array にエンコードする
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // メッセージをハッシュする
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // バッファーをバイト列に変換する
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return parseInt(hashHex.substring(0, 4), 16) % 255;
};

export const storageKey = (key: number) => `suggests-${key}`;
export const getStorageKey = async (str: string) => storageKey(await hash(str));

export const getSuggests = (
  key: string
): Promise<{ [key: string]: Suggest[] }> => browser.storage.local.get(key);
export const setSuggestions = (key: string, suggests: Suggest[]) =>
  browser.storage.local.set({ [key]: suggests });

export const addSuggest = async (suggest: Suggest) => {
  const key = await getStorageKey(suggest.url);
  const suggests = await getSuggests(key);
  setSuggestions(key, [...(suggests[key] || []), suggest]);
};

export const saveExampleSuggests = async () => {
  setSuggestions(await getStorageKey(exampleUrl), exampleSuggests);
  console.log('exampleSuggests saved', JSON.stringify(exampleSuggests));
};
