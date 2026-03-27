import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { MdLogout } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden overflow-y-auto text-text">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col bg-background">
        {/* Top bar — desktop only */}
        <div className="hidden md:flex text-sm fixed top-0 right-0 left-20 z-50 justify-end items-center gap-2.5 p-8 pr-10 bg-background text-light">
          <p>Hola, {user ? user.name : "Guest"}</p>
          <MdLogout
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="cursor-pointer hover:text-text text-xl"
          />
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
