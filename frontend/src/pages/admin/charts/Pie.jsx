import { Box } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import Header from "../../../components/admin/Header";
import { mockPieData } from "../../../data/mockData";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="PIE CHART" subtitle="Fleet Distribution by Category" />
      
      <Box 
        height="75vh" 
        sx={{ backgroundColor: "white", p: "20px", borderRadius: "8px" }}
        className="shadow-sm"
      >
        <ResponsivePie
          data={mockPieData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5} // Creates the "donut" look
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
          // Using your brand color palette
          colors={["#dc2626", "#111827", "#4b5563", "#9ca3af", "#ef4444"]}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
          ]}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default Pie;