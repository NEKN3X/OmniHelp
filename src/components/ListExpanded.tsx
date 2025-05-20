import { atom, useAtom } from 'jotai';
import { CommandAtom as commandAtom } from './FormHelp';
import { expandWithGlossary, getGlossary } from '@/utils/glossary';

export const expandedAtom = atom(async (get) => {
  try {
    const glossary = await getGlossary();
    const command = get(commandAtom);
    return expandWithGlossary(glossary)(command);
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
            {expanded.map((x, i) => (
              <li key={`${i}-${x}`}>・{x}</li>
            ))}
          </ol>
        </>
      )}
    </>
  );
};

export default ListExpanded;
