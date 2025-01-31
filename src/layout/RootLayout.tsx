import AppHeader from '@/components/app/AppHeader';
import Sidebar from '@/components/app/Sidebar';
import { Affix, Spin } from 'antd';
import { Outlet, useNavigation } from 'react-router';

const RootLayout = () => {
  const { state } = useNavigation();

  return (
    <section>
      <div className="flex">
        <Affix offsetTop={0}>
          <Sidebar />
        </Affix>
        <div className="flex-grow overflow-hidden">
          <AppHeader />
          <main className="relative h-[calc(100vh-70px)] overflow-auto no-scrollbar scroll-smooth px-6 py-4">
            <Outlet />
          </main>
        </div>
      </div>

      {state == 'loading' && (
        <div className="fixed left-0 top-0 z-[99999] grid h-screen w-screen place-items-center bg-black/60">
          <Spin size="large" />
        </div>
      )}
    </section>
  );
};
export default RootLayout;
