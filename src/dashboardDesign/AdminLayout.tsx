import { Outlet } from 'react-router-dom';
import Card from './Card';
import { AdminSideNav } from './AdminSidenav';
import { Navbar } from '../components/Navbar';

export const AdminLayout = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col overflow-hidden bg-gradient-to-br from-white to-purple-50">
     
      <Navbar/>
      {/* Content area (sidebar + main) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-52 flex-shrink-0">
          <AdminSideNav />
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Card>
            <Outlet />
          </Card>
        </div>
      </div>
    </div>
  );
};