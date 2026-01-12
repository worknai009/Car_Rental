import { Box, Typography, IconButton } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import Header from "../../../components/admin/Header";
import { useEffect, useState } from "react";
import adminApi from "../../../utils/adminApi";
import { RefreshCw } from "lucide-react";

const Bar = () => {
  const [chartData, setChartData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBar = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/charts/bar"); // ✅ dynamic
      setChartData(Array.isArray(res.data?.data) ? res.data.data : []);
      setKeys(Array.isArray(res.data?.keys) ? res.data.keys : []);
    } catch (err) {
      console.error("Bar fetch error:", err);
      alert(err.response?.data?.message || "Failed to load bar chart data");
      setChartData([]);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBar();
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="BAR CHART" subtitle="Rental Revenue by Car Category" />
        <IconButton onClick={fetchBar} title="Refresh">
          <RefreshCw size={18} />
        </IconButton>
      </Box>

      <Box height="75vh" className="bg-white p-4 rounded-lg shadow-sm">
        {loading ? (
          <Typography>Loading...</Typography>
        ) : chartData.length === 0 || keys.length === 0 ? (
          <Typography>No bar data found.</Typography>
        ) : (
          <ResponsiveBar
            data={chartData}
            keys={keys}
            indexBy="month"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Month",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Revenue (₹)",
              legendPosition: "middle",
              legendOffset: -50,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 110,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 18,
              },
            ]}
            role="application"
            ariaLabel="Nivo bar chart showing car rental revenue by category"
          />
        )}
      </Box>
    </Box>
  );
};

export default Bar;
