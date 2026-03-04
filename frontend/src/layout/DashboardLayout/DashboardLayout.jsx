import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./DashboardLayout.css";
import { MdLogout } from "react-icons/md";

function DashboardLayout() {
  return (
    <div className="dashboardLayout">
      <Sidebar />
      <div className="mainContent">
        <div className="topBar">
          <p>Hola, User</p>
          <MdLogout id="logoutTopbar" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
