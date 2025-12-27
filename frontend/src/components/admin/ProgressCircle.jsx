import { Box, useTheme } from "@mui/material";

const ProgressCircle = ({ progress = "0.75", size = "40" }) => {
  const angle = progress * 360;
  
  return (
    <Box
      sx={{
        background: `radial-gradient(#ffffff 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, #e5e7eb ${angle}deg 360deg),
            #dc2626`, // Your brand red
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;