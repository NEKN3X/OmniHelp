import Card from '@/components/Card';
import FormHelp from '@/components/FormHelp';
import ListExpanded from '@/components/ListExpanded';
import ListHelp from '@/components/ListHelp';
import { atom } from 'jotai';
import '~/assets/App.css';

export const tabAtom = atom(async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
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
        </div>
      </Card>
    </>
  );
}

export default App;
