import { Outlet } from 'react-router-dom';
import Card from './Card';
import { SideNav } from './Sidenav';

export const Layout = () => {
  return (
       <div className='flex h-screen w-screen bg-gradient-to-br from-white to-purple-50'>
      <div className='w-[12%] flex-shrink-0'>
        <SideNav />
      </div>

      <div className='flex-1 flex flex-col overflow-auto'>
        <div className="p-4 flex-grow h-full">
          <Card>
            <Outlet />
          </Card>
        </div>
      </div>
    </div>
  );
};