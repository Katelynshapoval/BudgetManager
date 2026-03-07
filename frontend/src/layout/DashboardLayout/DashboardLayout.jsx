import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { MdLogout } from "react-icons/md";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden overflow-y-auto text-text">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col bg-background">
        {/* Top bar — desktop only */}
        <div className="hidden md:flex text-sm fixed top-0 right-0 left-20 z-50 justify-end items-center gap-2.5 p-8 pr-10 bg-background text-light">
          <p>Hola, User</p>
          <MdLogout className="cursor-pointer hover:text-text text-xl" />
        </div>
        {/* Page content */}
        <div className="p-6 pt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
