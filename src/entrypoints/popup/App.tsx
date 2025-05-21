import { activeTabs } from '@/utils/browser';
import { atom } from 'jotai';
import '~/assets/App.css';

export const tabAtom = atom(async () => {
  const tabs = await activeTabs();
  if (tabs.length === 0) return undefined;
  return tabs[0];
});
export const urlAtom = atom((get) => get(tabAtom).then((tab) => tab?.url));

function App() {
  return (
    <>
      <Card>
        <div className="flex flex-col gap-2 text-left select-none">
          <FormHelp />
          <ListExpanded />
          <ListHelp />
          <ListScrapboxHelp />
          <hr className="text-gray-300" />
          <ImportGlossary />
          <ExportStorage />
        </div>
      </Card>
    </>
  );
}

export default App;
