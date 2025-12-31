import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { LayoutDashboard, Users, ShoppingCart ,Car, Receipt, Calendar, BarChart3, PieChart, Menu as MenuIcon } from "lucide-react";
=======
import { LayoutDashboard, Users, Receipt, Car, Calendar, BarChart3,  PieChart, Menu as MenuIcon } from "lucide-react";
>>>>>>> bb76145e2e9992cd11b352c30e0f15f43c584289

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
        <MenuItem icon={<Car />} component={<Link to="/admin/createcategory" />}> Add Categories </MenuItem>
        <MenuItem icon={<Car />} component={<Link to="/admin/addcar" />}> Add Cars </MenuItem>
        <MenuItem icon={<Car />} component={<Link to="/admin/carlist" />}>Cars List</MenuItem>
        <MenuItem icon={<Users />} component={<Link to="/admin/users" />}>User</MenuItem>
        <MenuItem icon={<ShoppingCart  />} component={<Link to="/admin/bookings" />}>Booking cars</MenuItem>



        <p className="text-xs text-gray-500 px-6 py-2 uppercase">Charts</p>
        <MenuItem icon={<BarChart3 />} component={<Link to="/admin/bar" />}> Bar Chart </MenuItem>
        <MenuItem icon={<PieChart />} component={<Link to="/admin/pie" />}> Pie Chart </MenuItem>

         <p className="text-xs text-gray-500 px-6 py-2 uppercase">Cars</p>
        <MenuItem icon={<Car />} component={<Link to="/admin/cars" />}> Bar Chart </MenuItem>
        
        

      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;