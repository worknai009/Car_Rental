import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Header from "../../components/admin/Header";
import StatBox from "../../components/admin/StatBox";
import { IndianRupee, ShoppingCart, Users, Car } from "lucide-react";

// ✅ Use adminApi (auto token + auto logout 401/403)
import adminApi from "../../utils/adminApi";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // ✅ Dynamic API call
      const res = await adminApi.get("/admin/dashboard");

      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      // ✅ no need to handle logout here (adminApi interceptor handles it)
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Typography m="20px">Loading dashboard...</Typography>;

  return (
    <Box m="20px">
      <Header title="DASHBOARD" subtitle="Welcome to your car rental overview" />

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mt="20px">
        <Box gridColumn="span 5">
          <StatBox
            title={`₹${data?.totalRevenue ?? 0}`}
            subtitle="Monthly Revenue"
            icon={<IndianRupee size={26} />}
          />
        </Box>

        <Box gridColumn="span 5">
          <StatBox
            title={data?.bookingCount ?? 0}
            subtitle="New Bookings"
            icon={<ShoppingCart size={26} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatBox
            title={data?.fleetMileage ?? 0}
            subtitle="Total Cars"
            icon={<Car size={26} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatBox
            title={data?.activeClients ?? 0}
            subtitle="Total Users"
            icon={<Users size={26} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatBox
           title={data?.carRegisterUsers ?? 0}

            subtitle="Total Car Register Users"
            icon={<Users size={26} />}
          />

        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
