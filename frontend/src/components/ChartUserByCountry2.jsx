import * as React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { axiosInstance } from '../config/api';

import {
  IndiaFlag,
  UsaFlag,
  BrazilFlag,
  GlobeFlag,
} from '../internals/components/CustomIcons';

// const orderStatusData = {
//   labels: ["Pending", "In Progress", "Completed", "Cancelled"],
//   datasets: [
//     {
//       label: "Order Status Distribution",
//       backgroundColor: [
//         "#ff9800", "#4caf50", "#2196f3", "#f44336"
//       ],
//       data: [1, 2, 3, 1]
//     }
//   ]
// };

// PieCenterLabel Component
const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

function PieCenterLabel({ primaryText, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;
  const userId = localStorage.getItem('targetId');
  

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

PieCenterLabel.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

export default function ChartUserByCountry() {
  const [orders, setOrders] = React.useState([]);
  const [orderStatusData, setOrderStatusData] = React.useState(null);
  const userId = localStorage.getItem('targetId');

  React.useEffect(() => {
    const fetchOrders = async () =>  {
      try {
        const response = await axiosInstance.get(`/admin-dashboard/${userId}`);
        console.log("response78:", response.data.orderStatusData);
        setOrders(response.data);
        setOrderStatusData(response.data.orderStatusData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Ensure orderStatusData and datasets are available before mapping
  const data = orderStatusData?.datasets?.[0]?.data?.map((value, index) => ({
    label: orderStatusData.labels[index],
    value,
  })) || [];  // Default to an empty array if undefined

  // Set up the colors based on the data
  const colors = orderStatusData?.datasets?.[0]?.backgroundColor || [];

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Order Status Distribution
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PieChart
            colors={colors}
            margin={{
              left: 80,
              right: 80,
              top: 80,
              bottom: 80,
            }}
            series={[
              {
                data: data,
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 0,
                highlightScope: { faded: 'global', highlighted: 'item' },
              },
            ]}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel primaryText="Total" secondaryText="Orders" />
          </PieChart>
        </Box>
        {data?.map((country, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{ alignItems: 'center', gap: 2, pb: 2 }}
          >
            {/* Example flag icon, replace with dynamic flags if available */}
            <Box sx={{ width: 20, height: 20, backgroundColor: colors[index] }} />
            <Stack sx={{ gap: 1, flexGrow: 1 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {country.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {country.value}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                aria-label="Order Status Distribution"
                value={(country.value / 7) * 100} // Normalize percentage based on max value
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    backgroundColor: colors[index],
                  },
                }}
              />
            </Stack>
          </Stack>
        ))}
      </CardContent>
    </Card>
  );
}

