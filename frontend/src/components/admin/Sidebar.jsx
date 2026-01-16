import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Receipt,
  BarChart3,
  PieChart,
  Menu as MenuIcon,
  Car,
  Layers,
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ProSidebar
      collapsed={isCollapsed}
      backgroundColor="#111827"
      rootStyles={{ color: "#d1d5db", border: "none" }}
    >
      <Menu menuItemStyles={{ button: { "&:hover": { backgroundColor: "#1f2937" } } }}>
        {/* Header / Toggle */}
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuIcon /> : undefined}
        >
          {!isCollapsed && <h3 className="text-xl font-bold text-white p-4">ADMIN</h3>}
        </MenuItem>

        {/* Dashboard */}
        <MenuItem icon={<LayoutDashboard />} component={<Link to="/admin/dashboard" />}>
          Dashboard
        </MenuItem>

        <p className="text-xs text-gray-500 px-6 py-2 uppercase">Data</p>
        <MenuItem icon={<Users />} component={<Link to="/admin/team" />}>
          Users
        </MenuItem>

        <MenuItem icon={<Receipt />} component={<Link to="/admin/bookings" />}>
          Bookings
        </MenuItem>
         <MenuItem icon={<Receipt />} component={<Link to="/admin/contacts" />}>
          Contact List
        </MenuItem>

  <MenuItem icon={<Receipt />} component={<Link to="/admin/cancel-requests">Cancel Requests</Link>
}>
          Cancal Request
        </MenuItem>

        <MenuItem icon={<Receipt />} component={<Link to="/admin/feedback">Feedback List</Link>
}>
          FeedBack List
        </MenuItem>

        <p className="text-xs text-gray-500 px-6 py-2 uppercase">Cars Data</p>
        <MenuItem icon={<Layers />} component={<Link to="/admin/categories/add" />}>
          Add Category
        </MenuItem>
        <MenuItem icon={<Layers />} component={<Link to="/admin/categories" />}>
          Category List
        </MenuItem>
        <MenuItem icon={<Car />} component={<Link to="/admin/cars/add" />}>
          Add Cars
        </MenuItem>
        <MenuItem icon={<Car />} component={<Link to="/admin/cars" />}>
          Cars List
        </MenuItem>

        <p className="text-xs text-gray-500 px-6 py-2 uppercase">Charts</p>
        <MenuItem icon={<BarChart3 />} component={<Link to="/admin/bar" />}>
          Bar Chart
        </MenuItem>
        <MenuItem icon={<PieChart />} component={<Link to="/admin/pie" />}>
          Pie Chart
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
