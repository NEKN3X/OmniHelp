import { urlAtom } from '@/entrypoints/popup/App';
import { atom, useAtom } from 'jotai';

export const CommandAtom = atom<string>('');

const FormHelp: React.FC = () => {
  const [command, setCommand] = useAtom(CommandAtom);
  const [url] = useAtom(urlAtom);

  return (
    <>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('command') as HTMLInputElement;
          if (!url) return;
          const help = makeHelp(url, input.value);
          registerHelp([help]);
          setCommand('');
          window.close();
        }}
      >
        <div className="flex items-center">? </div>
        <input
          autoFocus
          className="flex-1 rounded-sm border border-gray-500 px-1"
          name="command"
          type="text"
          placeholder="Helpfeel記法で入力"
          value={command}
          spellCheck="false"
          onChange={(e) => {
            setCommand(e.target.value);
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
    </>
  );
};

export default FormHelp;
