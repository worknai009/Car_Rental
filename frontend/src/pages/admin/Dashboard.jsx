import { Box, Button, IconButton, Typography } from "@mui/material";
import { Download, Car, Users, IndianRupee, ShoppingCart } from "lucide-react";
import Header from "../../components/admin/Header";
import StatBox from "../../components/admin/StatBox";

const Dashboard = () => {
  return (
    <Box m="20px">
      {/* HEADER & DOWNLOAD BUTTON */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your car rental overview" />

        <Box>
          <Button
            sx={{
              backgroundColor: "#dc2626",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID SYSTEM */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1: STAT BOXES */}
        <Box gridColumn="span 3" className="flex items-center justify-center">
          <StatBox
            title="₹1,24,500"
            subtitle="Monthly Revenue"
            progress="0.75"
            increase="+14%"
            icon={<IndianRupee className="text-red-600" size={26} />}
          />
        </Box>
        <Box gridColumn="span 3" className="flex items-center justify-center">
          <StatBox
            title="452"
            subtitle="New Bookings"
            progress="0.50"
            increase="+21%"
            icon={<ShoppingCart className="text-red-600" size={26} />}
          />
        </Box>
        <Box gridColumn="span 3" className="flex items-center justify-center">
          <StatBox
            title="12,361"
            subtitle="Fleet Mileage"
            progress="0.30"
            increase="+5%"
            icon={<Car className="text-red-600" size={26} />}
          />
        </Box>
        <Box gridColumn="span 3" className="flex items-center justify-center">
          <StatBox
            title="1,225"
            subtitle="Active Clients"
            progress="0.80"
            increase="+43%"
            icon={<Users className="text-red-600" size={26} />}
          />
        </Box>

        {/* ROW 2: REVENUE CHART & RECENT TRANSACTIONS */}
        <Box gridColumn="span 8" gridRow="span 2" className="bg-white rounded-lg p-5 shadow-sm">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="600" color="#111827">
              Revenue Analytics
            </Typography>
          </Box>
          <Box height="250px" mt="-20px">
            {/* You would insert your <LineChart /> component here */}
            <div className="w-full h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg mt-5">
               Nivo Line Chart Placeholder
            </div>
          </Box>
        </Box>

        <Box gridColumn="span 4" gridRow="span 2" className="bg-white rounded-lg p-5 shadow-sm overflow-auto">
          <Typography variant="h5" fontWeight="600" color="#111827" mb="15px">
            Recent Rentals
          </Typography>
          {[1, 2, 3, 4].map((item, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid #f3f4f6"
              p="15px 0"
            >
              <Box>
                <Typography color="#dc2626" fontWeight="600">BMW X5</Typography>
                <Typography color="#6b7280" variant="body2">John Doe</Typography>
              </Box>
              <Box color="#111827">2025-12-26</Box>
              <Box className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                ₹5,500
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;