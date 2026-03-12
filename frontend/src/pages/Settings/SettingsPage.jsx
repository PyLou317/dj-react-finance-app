import { Outlet } from 'react-router';
import PageWrapper from '../../components/PageWrapper';
import MainTitle from '../../components/MainTitle';
import SettingsMenu from './SettingsMenu';

export default function TransactionsPage() {
  return (
    <PageWrapper>
      <div className="p-4 bg-white rounded-xl">
        <div className='hidden sm:block'>
          <MainTitle name="Settings" />
        </div>
        <div className="flex mt-4">
          <div className="hidden md:block w-80">
            <SettingsMenu />
          </div>
          <div className="flex-1 sm:px-6">
            <Outlet />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
