import { Box, Typography, IconButton } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import Header from "../../../components/admin/Header";
import { useEffect, useState } from "react";
import adminApi from "../../../utils/adminApi";
import { RefreshCw } from "lucide-react";

const Pie = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPie = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/charts/pie"); // ✅ dynamic API
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Pie fetch error:", err);
      alert(err.response?.data?.message || "Failed to load pie data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPie();
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PIE CHART" subtitle="Fleet Distribution by Category" />
        <IconButton onClick={fetchPie} title="Refresh">
          <RefreshCw size={18} />
        </IconButton>
      </Box>

      <Box
        height="75vh"
        sx={{ backgroundColor: "white", p: "20px", borderRadius: "8px" }}
        className="shadow-sm"
      >
        {loading ? (
          <Typography>Loading...</Typography>
        ) : !data || data.length === 0 ? (
          <Typography>No data found.</Typography>
        ) : (
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableArcLinkLabels={true}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#374151"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 110,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
              },
            ]}
          />
        )}
      </Box>
    </Box>
  );
};

export default Pie;
