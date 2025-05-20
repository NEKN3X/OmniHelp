import { exportStorage, importStorage } from '@/utils/export';
import { CiExport, CiImport } from 'react-icons/ci';

const ExportStorage: React.FC = () => {
  return (
    <>
      <div className="flex flex-row-reverse gap-2">
        <CiExport
          onClick={exportStorage}
          className="hover:cursor-pointer hover:text-gray-500"
        />
        <CiImport
          onClick={importStorage}
          className="hover:cursor-pointer hover:text-gray-500"
        />
      </div>
    </>
  );
};

export default ExportStorage;
