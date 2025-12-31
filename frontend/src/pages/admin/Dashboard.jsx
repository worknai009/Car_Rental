import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/admin/Header";
import StatBox from "../../components/admin/StatBox";
import { IndianRupee, ShoppingCart, Users, Car } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

const fetchDashboard = async () => {
  try {
    const res = await axios.get("http://localhost:1000/admin/dashboard");
    setData(res.data);
  } catch (err) {
    console.error("Dashboard error", err);
  }
};


  if (!data) return <Typography m="20px">Loading dashboard...</Typography>;

  return (
    <Box m="20px">
      <Header title="DASHBOARD" subtitle="Welcome to your car rental overview" />
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        <Box gridColumn="span 3">
          <StatBox
            title={`₹${data.totalRevenue}`}
            subtitle="Monthly Revenue"
            icon={<IndianRupee size={26} />}
          />
        </Box>
        <Box gridColumn="span 3">
          <StatBox
            title={data.bookingCount}
            subtitle="New Bookings"
            icon={<ShoppingCart size={26} />}
          />
        </Box>
        <Box gridColumn="span 3">
          <StatBox
            title={data.fleetMileage}
            subtitle="Fleet Mileage"
            icon={<Car size={26} />}
          />
        </Box>
        <Box gridColumn="span 3">
          <StatBox
            title={data.activeClients}
            subtitle="Active Clients"
            icon={<Users size={26} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
