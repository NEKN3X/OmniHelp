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
  if (!info) return [];
  if (!tab?.id) return [];
  const lines = await browser.scripting.executeScript<
    string[],
    { text: string }[]
  >({
    target: { tabId: tab.id },
    files: ['content-scripts/scrapbox.js'],
  });
  console.log('lines', lines);
});

const ListScrapboxHelp: React.FC = () => {
  const [url] = useAtom(urlAtom);
  const [scrapboxInfo] = useAtom(scrapboxInfoAtom);
  const [lines] = useAtom(scrapboxHelpsAtom);

  return (
    <>
      {url && scrapboxInfo?.title && lines && (
        <>
          <hr className="text-gray-300" />
          <div className="text-left select-none">
            <div className="flex hover:bg-gray-50">
              <span className="flex-1">このページのヘルプを取り込む</span>
              <span
                className="flex items-center p-1 hover:bg-green-50 hover:text-green-400"
                onClick={() => {
                  // const data = scrapboxHelps.map((x) =>
                  //   makeHelp(open.current || url.current, x, url.current)
                  // );
                  // registerHelp(data);
                }}
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
              {lines.map((x, i) => (
                <li
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  key={`${i}-${x}`}
                >
                  ・{x}
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
