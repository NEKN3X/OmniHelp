import { withErrorBoundary, withSuspense } from '@extension/shared';
import '@src/Popup.css';
import { onClickRegister, onClickUnregister } from '@src/register';
import { ReactNode } from 'react';
import { saveExample } from '../../../chrome-extension/src/storage';

// ボタンを3つ並べる
// 1. ページを登録する
// 2. プロジェクト全体を登録する
// 3. 設定を開く
const Popup = () => {
  return (
    <div className="App">
      <div className="h-full flex flex-col gap-4">
        <div className="flex-1 flex items-center justify-center">
          <Button
            onClick={async () => {
              await onClickRegister();
              window.close();
            }}
            className="bg-blue-500 hover:bg-blue-400">
            このページを登録する
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Button onClick={saveExample} className="bg-green-500 hover:bg-green-400">
            このプロジェクト全体を登録する
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Button
            onClick={async () => {
              await onClickUnregister();
              window.close();
            }}
            className="bg-yellow-500 hover:bg-yellow-400">
            このページの登録を解除する
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Button className="bg-gray-500 hover:bg-gray-400">設定を開く</Button>
        </div>
      </div>
    </div>
  );
};

const Button: React.FC<{ className: string; onClick?: () => void; children: ReactNode }> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <button onClick={onClick} className={`${className} text-white px-4 py-2 rounded w-full h-full`}>
        {children}
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
