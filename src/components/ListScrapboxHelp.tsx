import { tabAtom, urlAtom } from '@/entrypoints/popup/App';
import { atom, useAtom } from 'jotai';
import { GoPlus } from 'react-icons/go';
import { IoClose } from 'react-icons/io5';

export const scrapboxInfoAtom = atom(async (get) => {
  const url = await get(urlAtom);
  if (!url) return undefined;
  return scrapboxInfo(url);
});
const scrapboxHelpsAtom = atom(async (get) => {
  const info = await get(scrapboxInfoAtom);
  const tab = await get(tabAtom);
  const url = await get(urlAtom);
  if (!info) return [];
  if (!tab?.id) return [];
  if (!url) return [];
  const lines = await browser.scripting
    .executeScript<string[], { text: string }[]>({
      target: { tabId: tab.id },
      files: ['content-scripts/scrapbox.js'],
    })
    .then((res) => res[0].result?.map((x) => x.text.trim()));
  if (!lines) return [];
  return extractHelp(url, lines);
});

const ListScrapboxHelp: React.FC = () => {
  const [url] = useAtom(urlAtom);
  const [scrapboxInfo] = useAtom(scrapboxInfoAtom);
  const [extracted] = useAtom(scrapboxHelpsAtom);

  return (
    <>
      {url && scrapboxInfo?.title && extracted && (
        <>
          <hr className="text-gray-300" />
          <div className="text-left select-none">
            <div className="flex">
              <span className="flex-1">このページのヘルプを取り込む</span>
              <span
                className="flex items-center p-1 hover:bg-green-50 hover:text-green-400"
                onClick={() => registerHelp(extracted)}
              >
                <GoPlus />
              </span>
              <span
                onClick={() => unregisterScrapboxHelp(url)}
                className="flex items-center p-1 hover:bg-red-50 hover:text-red-400"
              >
                <IoClose />
              </span>
            </div>
            <ol className="list-outside list-none tracking-wide">
              {extracted.map((x, i) => (
                <li
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  key={`${i}-${x.command}-${x.open}`}
                >
                  ・{x.command}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </>
  );
};

export default ListScrapboxHelp;
