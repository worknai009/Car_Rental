import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./admin/Sidebar";
import Topbar from "./admin/Topbar";

const AdminLayout = () => {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - react-pro-sidebar */}
      <Sidebar isSidebar={isSidebar} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar - Search, Profile, Notifications */}
        <Topbar setIsSidebar={setIsSidebar} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Admin pages like Dashboard, Team, etc. render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;