import { useMemo } from "react";

// Prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// React-chartjs-2 components
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// PieChart configurations
import configs from "./configs";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ icon, title, description, height, chart }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  const renderChart = (
    <Box py={2} pr={2} pl={icon.component ? 1 : 2}>
      {title || description ? (
        <Box display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
        <Box mt={0}>
          {title && <Typography variant="h6" fontWeight="bold">{title}</Typography>}
          <Box mb={2}>
            <Typography component="div" variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      ) : null}
      {useMemo(
        () => (
          <Box height={height}>
            <Pie data={data} options={options} redraw />
          </Box>
        ),
        [data, height, options]
      )}
    </Box>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of PieChart
PieChart.defaultProps = {
  icon: { color: "info", component: "" },
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the PieChart
PieChart.propTypes = {
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
    component: PropTypes.node,
  }),
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  ).isRequired,
};

export default PieChart;
