const InputHelp: React.FC = () => {
  const [text, setText] = useState<string>('');
  const url = useRef<string>('');
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const currentTab = tabs[0];
      if (!currentTab) return;
      url.current = currentTab.url || '';
    });
  }, []);

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
            input.value = '';
            // window.close();
          }}
        >
          <div className="flex items-center">? </div>
          <input
            autoFocus
            className="border-1 px-1"
            name="helpInput"
            type="text"
            placeholder="Helpfeel記法で入力"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            autoComplete="off"
          />
          <button className="w-max p-1 text-xs" type="submit">
            登録
          </button>
        </form>
        <div className="select-none">
          <div>展開後▼</div>
          <ol className="inline-block">
            <li>aaa</li>
            <li>aaa</li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default InputHelp;
