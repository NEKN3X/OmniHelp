import { tabAtom, urlAtom } from '@/entrypoints/popup/App';
import { atom, useAtom, useSetAtom } from 'jotai';
import { CiBookmark } from 'react-icons/ci';

export const scrapboxInfoAtom = atom(async (get) => {
  const url = await get(urlAtom);
  if (!url) return undefined;
  return scrapboxInfo(url);
});
const extractedAtom = atom(async (get) => {
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
const scrapboxHelpsAtom = atom<Help[]>([]);

const ListScrapboxHelp: React.FC = () => {
  const [url] = useAtom(urlAtom);
  const [scrapboxInfo] = useAtom(scrapboxInfoAtom);
  const [helps, setHelps] = useAtom(scrapboxHelpsAtom);
  const [extracted] = useAtom(extractedAtom);

  useEffect(() => {
    getAllHelps().then((data) => {
      setHelps(data.filter((x) => isScrapboxHelp(x) && x.page === url));
    });
    const unwatch = watchHelps((data) => {
      setHelps(data.filter((x) => isScrapboxHelp(x) && x.page === url));
    });
    return () => {
      unwatch();
    };
  }, []);
  useEffect(() => {
    if (extracted.length > 0) {
      registerHelp(extracted);
    } else {
      if (!url) return;
      unregisterScrapboxHelp(url);
    }
  }, []);

  return (
    <>
      {url && scrapboxInfo?.title && helps.length > 0 && (
        <>
          <hr className="text-gray-300" />
          <div>
            <div>このページのHelpfeel記法</div>
            <ol className="list-outside list-none tracking-wide">
              {helps.map((x, i) => (
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
