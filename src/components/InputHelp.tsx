import { cn } from '@/utils/cn';
import { expand } from '@/utils/parser/helpfeel';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { TbTriangleInvertedFilled } from 'react-icons/tb';

const InputHelp: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [help, setHelp] = useState<Help[]>([]);
  const url = useRef<string>('');
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const currentTab = tabs[0];
      if (!currentTab) return;
      url.current = currentTab.url || '';
    });
  }, []);
  useEffect(() => {
    helpData.getValue().then((data) => {
      setHelp(data.filter((x) => x.url === url.current));
    });
    const unwatch = helpData.watch((data) => {
      setHelp(data.filter((x) => x.url === url.current));
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
            register(url.current, input.value);
            setText('');
            // window.close();
          }}
        >
          <div className="flex items-center">? </div>
          <input
            autoFocus
            className="rounded-sm border-1 border-gray-500 px-1"
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
          <div className="after:pl-0.5">展開後</div>
          {expanded.length > 0 && (
            <ol className="list-outside list-none pl-2 text-xs tracking-wide">
              {expanded.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          )}
        </div>
        <hr className="text-gray-300" />
        <div className="text-left select-none">
          <div className="after:pl-0.5">このページのヘルプ</div>
          <ol className="list-outside list-none tracking-wide">
            {help.map((x) => (
              <li className="flex pl-2 hover:bg-gray-50" key={x.command}>
                <div className="flex-1">{x.command}</div>
                <div
                  onClick={() => removeHelp(url.current, x.command)}
                  className="flex items-center p-1 hover:bg-red-50 hover:text-red-400"
                >
                  <IoClose />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default InputHelp;
