import { Box, useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import Header from "../../../components/admin/Header";
import { mockGeographyData } from "../../../data/mockGeoData.js";
import { geoFeatures } from "../../../data/mockGeoFeatures.js";

const Geography = () => {
  return (
    <Box m="20px">
      <Header title="GEOGRAPHY" subtitle="Global Distribution of Car Rentals" />
      
      <Box 
        height="75vh" 
        border="1px solid #e5e7eb" 
        borderRadius="8px" 
        sx={{ backgroundColor: "white" }}
        className="shadow-sm"
      >
        <ResponsiveChoropleth
          data={mockGeographyData}
          // Accessing the features array from our data file
          features={geoFeatures.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          domain={[0, 1000000]}
          unknownColor="#eeeeee"
          label="properties.name"
          valueFormat=".2s"
          projectionScale={150}
          projectionTranslation={[0.5, 0.5]}
          projectionRotation={[0, 0, 0]}
          enableGraticule={false}
          borderWidth={0.5}
          borderColor="#ffffff"
          // Customizing colors to match your brand (Red/Gray/Dark)
          colors="nivo" 
          legends={[
            {
              anchor: "bottom-left",
              direction: "column",
              justify: true,
              translateX: 20,
              translateY: -100,
              itemsSpacing: 0,
              itemWidth: 94,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemTextColor: "#4b5563",
              itemOpacity: 0.85,
              symbolSize: 18,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#dc2626", // Brand Red on hover
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default Geography;