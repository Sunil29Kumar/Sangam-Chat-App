import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

function Layout() {
  return (
    // Background color login page jaisa light slate rakha hai
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Sidebar: Fixed width to avoid layout shifts */}
      <Sidebar />

      {/* Main Content: Sidebar ki width (80px/w-20) ke barabar margin-left */}
      <main className="flex-1 ml-20 md:ml-24 h-full p-4 md:p-6 overflow-hidden">
        {/* Is div mein aapka Dashboard/Settings render hoga */}
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;