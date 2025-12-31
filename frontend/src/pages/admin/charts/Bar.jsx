import { Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import Header from "../../../components/admin/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const Bar = () => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    fetchBarData();
  }, []);

  const fetchBarData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        "http://localhost:1000/admin/bar",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(res.data.data);
      setKeys(res.data.keys);

    } catch (err) {
      console.error("Bar chart error", err);
    }
  };

  if (data.length === 0) {
    return (
      <Box m="20px">
        <Header title="BAR CHART" subtitle="No revenue data available" />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="BAR CHART" subtitle="Rental Revenue by Car Category" />

      <Box height="75vh" className="bg-white p-4 rounded-lg shadow-sm">
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy="month"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          axisBottom={{
            legend: "Month",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            legend: "Revenue (₹)",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              translateX: 120,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 20,
            },
          ]}
          role="application"
        />
      </Box>
    </Box>
  );
};

export default Bar;
