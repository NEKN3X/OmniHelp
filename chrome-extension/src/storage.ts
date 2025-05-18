export const hash = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message); // (utf-8 の) Uint8Array にエンコードする
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // メッセージをハッシュする
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // バッファーをバイト列に変換する
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // バイト列を 16 進文字列に変換する
  return parseInt(hashHex.substring(0, 4), 16) % 255;
};

export const storageKey = (key: number) => `suggests${key}`;
export const getStorageKey = async (str: string) => storageKey(await hash(str));

const exampleUrl = 'https://scrapbox.io/nekn3x/xyz';
const suggests: Suggest[] = [
  {
    url: exampleUrl,
    command: 'xyzに関する説明',
    expanded: ['xyzに関する説明', 'xyzに関する説明2'],
  },
  {
    url: exampleUrl,
    command: '123に関する説明',
    expanded: ['123に関する説明', '123に関する説明2'],
  },
];

export const saveExample = async () => {
  chrome.storage.local.set({
    [await getStorageKey(exampleUrl)]: suggests,
  });
};
