import { Outlet } from 'react-router';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col pl-64 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="px-10 py-10 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
