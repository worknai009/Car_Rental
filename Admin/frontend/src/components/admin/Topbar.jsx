import { Search, Bell, Settings, LogOut, User } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "{}");
    } catch {
      return {};
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex  rounded-md p-1 px-3 items-center w-[320px]">
       
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 text-gray-600">
        {/* Admin Name + Role */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-700" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800">
              {admin?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">
              Role: {admin?.role || "admin"}
            </p>
          </div>
        </div>

        {/* Icons */}
        <Bell className="w-5 h-5 cursor-pointer hover:text-red-600" />
        <Settings className="w-5 h-5 cursor-pointer hover:text-red-600" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
