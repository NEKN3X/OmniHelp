import { tabAtom, urlAtom } from '@/entrypoints/popup/App';
import { registerGlossary } from '@/utils/glossary';
import { extractGlossary } from '@/utils/scrapbox';
import { atom, useAtom } from 'jotai';

export const glossaryAtom = atom(async (get) => {
  const info = await get(scrapboxInfoAtom);
  const tab = await get(tabAtom);
  const url = await get(urlAtom);
  if (!info) return;
  if (!tab?.id) return;
  if (!url) return;
  const lines = await browser.scripting
    .executeScript<string[], { text: string }[]>({
      target: { tabId: tab.id },
      files: ['content-scripts/glossary.js'],
    })
    .then((res) => res[0].result?.map((x) => x.text.trim()));
  if (!lines) return;
  return extractGlossary(url, lines);
});

const ImportGlossary: React.FC = () => {
  const [glossary] = useAtom(glossaryAtom);
  return (
    <>
      {glossary && (
        <div className="text-right text-xs">
          <a
            onClick={async () => {
              await registerGlossary(glossary);
              await updateHelpsWithGlossary();
            }}
            href=""
            rel="noopener noreferrer"
          >
            Glossaryをインポートする
          </a>
        </div>
      )}
    </>
  );
};

export default ImportGlossary;
