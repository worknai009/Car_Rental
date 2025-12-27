import { Typography, Box, useTheme } from "@mui/material";

const Header = ({ title, subtitle }) => {
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color="#111827" // Dark Gray/Black from your theme
        fontWeight="bold"
        sx={{ m: "0 0 5px 0", textTransform: "uppercase", fontSize: "32px" }}
      >
        {title}
      </Typography>
      <Typography 
        variant="h5" 
        color="#dc2626" // Your brand red
        sx={{ fontSize: "16px" }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;