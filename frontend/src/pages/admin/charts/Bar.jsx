import { Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import Header from "../../../components/admin/Header";

// Mock Data: Comparing car categories over the last 3 months
const data = [
  { month: "Oct", SUV: 45, Sedan: 32, Hatchback: 20 },
  { month: "Nov", SUV: 55, Sedan: 28, Hatchback: 25 },
  { month: "Dec", SUV: 85, Sedan: 45, Hatchback: 30 },
];

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="BAR CHART" subtitle="Rental Revenue by Car Category" />
      
      <Box height="75vh" className="bg-white p-4 rounded-lg shadow-sm">
        <ResponsiveBar
          data={data}
          keys={["SUV", "Sedan", "Hatchback"]}
          indexBy="month"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={["#dc2626", "#111827", "#4b5563"]} // Red, Dark, Gray
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
            legend: "Revenue (in thousands)",
            legendPosition: "middle",
            legendOffset: -40,
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
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
            },
          ]}
          role="application"
          ariaLabel="Nivo bar chart showing car rental revenue"
        />
      </Box>
    </Box>
  );
};

export default Bar;