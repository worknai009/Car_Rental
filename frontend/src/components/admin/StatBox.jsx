import { Box, Typography } from "@mui/material";
import ProgressCircle from "../../components/admin/ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  return (
    <Box width="100%" p="20px" sx={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <Box display="flex" justifyContent="space-between">
        <Box>
          {/* Icon from Lucide-React */}
          <Box sx={{ color: "#dc2626", mb: "5px" }}>
            {icon}
          </Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#111827" }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="10px">
        <Typography variant="h5" sx={{ color: "#dc2626", fontSize: "14px" }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontWeight: "italic", color: "#16a34a", fontSize: "14px" }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;