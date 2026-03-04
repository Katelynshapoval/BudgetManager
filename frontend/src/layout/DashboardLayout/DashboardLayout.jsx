import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboardLayout">
      <Sidebar />
      <div className="mainContent">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
