import { Box } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import Header from "../../../components/admin/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const Pie = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPieData();
  }, []);

  const fetchPieData = async () => {
    try {
      const res = await axios.get("http://localhost:1000/admin/pie");

      console.log("Pie API data:", res.data);

      // ✅ BACKEND ALREADY RETURNS CORRECT FORMAT
      setData(res.data);
    } catch (err) {
      console.error("Pie chart error", err);
    }
  };

  return (
    <Box m="20px">
      <Header title="PIE CHART" subtitle="Fleet Distribution by Category" />

      <Box
        height="75vh"
        sx={{ backgroundColor: "white", p: "20px", borderRadius: "8px" }}
        className="shadow-sm"
      >
        {data.length > 0 ? (
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            colors={["#dc2626", "#111827", "#4b5563", "#9ca3af"]}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                symbolSize: 18,
                symbolShape: "circle",
              },
            ]}
          />
        ) : (
          <p className="text-center text-gray-500 mt-20">
            No data available
          </p>
        )}
      </Box>
    </Box>
  );
};

export default Pie;
