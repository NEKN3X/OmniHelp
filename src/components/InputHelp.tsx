import { expand } from '@/utils/parser/helpfeel';
import { GoPlus } from 'react-icons/go';
import { IoClose } from 'react-icons/io5';

const InputHelp: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [help, setHelp] = useState<Help[]>([]);
  const url = useRef<string>('');
  const open = useRef<string>(null);
  const info = scrapboxInfo(url.current);
  const [scrapboxHelps, setScrapboxHelps] = useState<string[]>([]);
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const currentTab = tabs[0];
      if (!currentTab) return;
      url.current = currentTab.url || '';
      const info = scrapboxInfo(url.current);
      if (!info) return;
      if (info.project !== '' && info.title !== '') {
        browser.scripting
          .executeScript<string[], { text: string }[]>({
            target: { tabId: currentTab.id! },
            files: ['content-scripts/scrapbox.js'],
          })
          .then((x) => {
            const lines = x[0].result?.map((x) => x.text.trim());
            console.log('lines', lines);
            const helps = lines
              ?.filter((x) => /^\?\s/.test(x))
              .map((x) => x.replace(/^\?\s/, ''));
            console.log('helps', helps);
            open.current =
              lines
                ?.filter((x) => /^%\s+(echo|open)\s+(.*)/.test(x))[0]
                ?.replace(/^%\s+(echo|open)\s+/, '') || '';
            setScrapboxHelps(helps || []);
          });
      }
    });
  }, []);
  useEffect(() => {
    getAllHelps().then((data) => {
      setHelp(
        data.filter((x) => x.open === url.current && x.page === undefined)
      );
    });
    const unwatch = watchHelps((data) => {
      setHelp(
        data.filter((x) => x.open === url.current && x.page === undefined)
      );
    });
    return () => {
      unwatch();
    };
  }, []);

  const expanded = useMemo(() => {
    try {
      return expand(text);
    } catch (e) {
      return [];
    }
  }, [text]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem(
              'helpInput'
            ) as HTMLInputElement;
            registerHelp([makeHelp(url.current, input.value)]);
            setText('');
            // window.close();
          }}
        >
          <div className="flex items-center">? </div>
          <input
            autoFocus
            className="flex-1 rounded-sm border-1 border-gray-500 px-1"
            name="helpInput"
            type="text"
            placeholder="Helpfeel記法で入力"
            value={text}
            spellCheck="false"
            onChange={(e) => {
              setText(e.target.value);
            }}
            autoComplete="off"
          />
          <button
            className="w-max rounded-sm border border-gray-500 bg-gray-100 p-1 text-xs hover:cursor-pointer hover:border-black"
            type="submit"
          >
            登録
          </button>
        </form>
        <div className="text-left select-none">
          <div>展開後</div>
          {expanded.length > 0 && (
            <ol className="list-outside list-none text-sm tracking-wide">
              {expanded.map((x) => (
                <li key={x}>・{x}</li>
              ))}
            </ol>
          )}
        </div>
        {help.length > 0 && (
          <>
            <hr className="text-gray-300" />
            <div className="text-left select-none">
              <div>このページのヘルプ</div>
              <ol className="list-outside list-none tracking-wide">
                {help.map((x) => (
                  <li className="flex hover:bg-gray-50" key={x.command}>
                    <div className="flex-1">・{x.command}</div>
                    <div
                      onClick={() => unregisterHelp(url.current, x.command)}
                      className="flex items-center p-1 hover:bg-red-50 hover:text-red-400"
                    >
                      <IoClose />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
        {scrapboxHelps.length > 0 && (
          <>
            <hr className="text-gray-300" />
            <div className="text-left select-none">
              <div className="flex hover:bg-gray-50">
                <span className="flex-1">このページのヘルプを取り込む</span>
                <span
                  className="flex items-center p-1 hover:bg-green-50 hover:text-green-400"
                  onClick={() => {
                    const data = scrapboxHelps.map((x) =>
                      makeHelp(open.current || url.current, x, url.current)
                    );
                    registerHelp(data);
                  }}
                >
                  <GoPlus />
                </span>
                <span
                  onClick={() => unregisterScrapboxHelp(url.current)}
                  className="flex items-center p-1 hover:bg-red-50 hover:text-red-400"
                >
                  <IoClose />
                </span>
              </div>
              <ol className="list-outside list-none tracking-wide">
                {scrapboxHelps.map((x, i) => (
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
        {info?.project !== '' && info?.title === '' && (
          <>
            <hr />
            <div className="flex hover:bg-gray-50">
              <span className="flex-1">このプロジェクトのヘルプを取り込む</span>
              <span
                className="flex items-center p-1 hover:bg-green-50 hover:text-green-400"
                onClick={() => {
                  browser.tabs
                    .query({ active: true, currentWindow: true })
                    .then((tabs) => {
                      const currentTab = tabs[0];
                      if (!currentTab) return;
                      browser.scripting
                        .executeScript<
                          string[],
                          { title: string; helpfeels: string[] }[]
                        >({
                          target: { tabId: currentTab.id! },
                          files: ['content-scripts/project.js'],
                        })
                        .then((x) => {
                          const pages = x[0].result
                            ?.filter((x) => x.helpfeels.length > 0)
                            .map((x) => ({
                              title: x.title,
                              helpfeels: x.helpfeels.map((x) => x.trim()),
                            }));
                          console.log('pages', pages);
                          pages?.forEach((x) => {
                            const data = x.helpfeels.map((y) =>
                              makeHelp(
                                `${url.current}${x.title}`,
                                y,
                                `${url.current}${x.title}`
                              )
                            );
                            registerHelp(data);
                          });
                        });
                    });
                }}
              >
                <GoPlus />
              </span>
              <span
                onClick={() => {}}
                className="flex items-center p-1 hover:bg-red-50 hover:text-red-400"
              >
                <IoClose />
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InputHelp;
