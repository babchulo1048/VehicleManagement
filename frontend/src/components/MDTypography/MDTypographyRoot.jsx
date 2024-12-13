import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// Direct color gradient logic
const gradients = {
  primary: "linear-gradient(45deg, #2196f3, #21cbf3)", // Example gradient
  secondary: "linear-gradient(45deg, #f50057, #ff4081)",
  info: "linear-gradient(45deg, #00bcd4, #00acc1)",
  success: "linear-gradient(45deg, #4caf50, #388e3c)",
  warning: "linear-gradient(45deg, #ff9800, #f57c00)",
  error: "linear-gradient(45deg, #f44336, #e53935)",
  dark: "linear-gradient(45deg, #212121, #616161)",
  light: "linear-gradient(45deg, #f5f5f5, #e0e0e0)",
};

const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
};

export default styled(Typography)(({ ownerState }) => {
  const { color, textTransform, verticalAlign, fontWeight, opacity, textGradient, darkMode } = ownerState;

  // Color logic
  let colorValue = color || "inherit"; // Default to "inherit" if no color is provided
  if (color === "dark" && darkMode) {
    colorValue = "#fff"; // White color for dark mode
  } else if (!gradients[color] && color !== "inherit") {
    colorValue = color || "#000"; // Fallback to black if invalid color
  }

  // Gradient styles logic
  const gradientStyles = () => ({
    backgroundImage:
      gradients[color] || gradients["dark"], // Fallback to dark gradient if no valid gradient
    display: "inline-block",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative",
    zIndex: 1,
  });

  return {
    opacity,
    textTransform,
    verticalAlign,
    textDecoration: "none",
    color: colorValue,
    fontWeight: fontWeights[fontWeight] || fontWeights.regular,
    ...(textGradient && gradientStyles()), // Apply gradient styles if textGradient is true
  };
});
