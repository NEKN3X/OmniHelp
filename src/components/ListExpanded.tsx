import { atom, useAtom } from 'jotai';
import { CommandAtom as commandAtom } from './FormHelp';
import { expand } from '@/utils/parser/helpfeel';

export const expandedAtom = atom<string[]>((get) => {
  try {
    return expand(get(commandAtom));
  } catch (e) {
    return [];
  }
});

const ListExpanded: React.FC = () => {
  const [expanded] = useAtom(expandedAtom);
  return (
    <>
      {expanded.length > 0 && (
        <>
          <div>展開後</div>
          <ol className="list-outside list-none text-sm tracking-wide">
            {expanded.map((x) => (
              <li key={x}>・{x}</li>
            ))}
          </ol>
        </>
      )}
    </>
  );
};

export default ListExpanded;
