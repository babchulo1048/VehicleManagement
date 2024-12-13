import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export default styled(Box)(({ ownerState }) => {
  const { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow } = ownerState;
  
  // Gradient and color logic
  const validGradients = [
    "primary", "secondary", "info", "success", "warning", "error", "dark", "light",
  ];

  const greyColors = {
    "grey-100": "#f0f0f0", // You can replace with actual hex values or any other colors
    "grey-200": "#d9d9d9",
    "grey-300": "#b3b3b3",
    "grey-400": "#808080",
    "grey-500": "#666666",
    "grey-600": "#4d4d4d",
    "grey-700": "#333333",
    "grey-800": "#1a1a1a",
    "grey-900": "#000000",
  };

  // Background gradient logic
  let backgroundValue = bgColor;

  if (variant === "gradient" && validGradients.includes(bgColor)) {
    // Apply linear gradient directly, or you can replace with your gradient colors
    backgroundValue = `linear-gradient(45deg, ${bgColor}, #fff)`;
  } else if (Object.keys(greyColors).includes(bgColor)) {
    backgroundValue = greyColors[bgColor];
  } else {
    backgroundValue = bgColor || "transparent";
  }

  // Color logic
  let colorValue = color || "black"; // Default to black if no color is provided

  // Border radius and box shadow
  const borderRadiusValue = borderRadius || "4px"; // Default radius value
  const boxShadowValue = shadow || "none"; // Default box shadow value

  return {
    opacity,
    background: backgroundValue,
    color: colorValue,
    borderRadius: borderRadiusValue,
    boxShadow: boxShadowValue,
  };
});
