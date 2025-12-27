import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Receipt, Calendar, BarChart3, PieChart, Menu as MenuIcon } from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ProSidebar collapsed={isCollapsed} backgroundColor="#111827" rootStyles={{ color: "#d1d5db", border: "none" }}>
      <Menu menuItemStyles={{ button: { "&:hover": { backgroundColor: "#1f2937" } } }}>
        
        {/* Header / Toggle */}
        <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} icon={isCollapsed ? <MenuIcon /> : undefined}>
          {!isCollapsed && <h3 className="text-xl font-bold text-white p-4">ADMIN</h3>}
        </MenuItem>

        {/* Navigation Links */}
        <MenuItem icon={<LayoutDashboard />} component={<Link to="/admin" />}> Dashboard </MenuItem>
        
        <p className="text-xs text-gray-500 px-6 py-2 uppercase">Data</p>
        <MenuItem icon={<Users />} component={<Link to="/admin/team" />}> Manage Team </MenuItem>
        <MenuItem icon={<Receipt />} component={<Link to="/admin/invoices" />}> Invoices </MenuItem>

        <p className="text-xs text-gray-500 px-6 py-2 uppercase">Charts</p>
        <MenuItem icon={<BarChart3 />} component={<Link to="/admin/bar" />}> Bar Chart </MenuItem>
        <MenuItem icon={<PieChart />} component={<Link to="/admin/pie" />}> Pie Chart </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;