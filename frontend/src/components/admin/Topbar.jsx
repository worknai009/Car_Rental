import { Search, Bell, Settings, User } from "lucide-react";

const Topbar = () => {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex bg-gray-100 rounded-md p-1 px-3 items-center">
        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm" />
        <Search className="w-4 h-4 text-gray-500" />
      </div>

      {/* Icons */}
      <div className="flex gap-4 text-gray-600">
        <Bell className="w-5 h-5 cursor-pointer hover:text-red-600" />
        <Settings className="w-5 h-5 cursor-pointer hover:text-red-600" />
        <User className="w-5 h-5 cursor-pointer hover:text-red-600" />
      </div>
    </div>
  );
};

export default Topbar;