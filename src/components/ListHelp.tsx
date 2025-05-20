import { urlAtom } from '@/entrypoints/popup/App';
import { useAtom } from 'jotai';
import { IoClose } from 'react-icons/io5';

const ListHelp: React.FC = () => {
  const [helpList, setHelpList] = useState<Help[]>([]);
  const [url] = useAtom(urlAtom);

  useEffect(() => {
    getAllHelps().then((data) => {
      setHelpList(data.filter((x) => isNormalHelp(x) && x.open === url));
    });
  }, []);

  return (
    <>
      {url && helpList.length > 0 && (
        <>
          <hr className="text-gray-300" />
          <div>
            <div>このページのヘルプ</div>
            <ol className="list-outside list-none tracking-wide">
              {helpList.map((x) => (
                <li className="flex hover:bg-gray-50" key={x.command}>
                  <div className="flex-1">・{x.command}</div>
                  <div
                    onClick={() => {
                      unregisterHelp(url, x.command);
                      setHelpList((prev) =>
                        prev.filter((item) => item.command !== x.command)
                      );
                    }}
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
    </>
  );
};

export default ListHelp;
