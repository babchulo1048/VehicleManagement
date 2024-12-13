import React, { useState, useEffect,useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { LineChart } from '@mui/x-charts/LineChart';
import { axiosInstance } from '../config/api';
import LoadingDialog from './LoadingDialog';

import socket from '../hook/SocketContext';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function SessionsChart() {
  const theme = useTheme();
  const [ordersData, setOrdersData] = useState([]);
  const [filter, setFilter] = useState('month');
  const [loading, setLoading] = useState(true);
  const [customDays, setCustomDays] = useState('');
  const [percentageChange, setPercentageChange] = useState(0);
  const [activeButton, setActiveButton] = useState("month"); 
  const userId = localStorage.getItem('targetId');


  
  

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin-dashboard/orders_filtered/${userId}`, {
        params: { filter },
      });
      console.log("response88:",response.data)
      const sortedData = response.data.orders.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setOrdersData(response.data.orders);

      const percentage = response.data.summary?.ordersTrend?.percentageChange || 0;
      setPercentageChange(percentage)

    } catch (error) {
      console.error('Error fetching orders data:', error);
      setOrdersData([]);
      setPercentageChange(0);
    } finally {
      setLoading(false);
    }
  }, [filter]);
 
  useEffect(() => {
    fetchData();
  
    // Set up socket listener
    socket.on('newOrder', fetchData);
  
    // Clean up socket listener on component unmount
    return () => {
      socket.off('newOrder', fetchData);
    };
  }, [fetchData]);


  const handleCustomDaysSubmit = (e) => {
    e.preventDefault();
    if (customDays && !isNaN(customDays) && parseInt(customDays) > 0) {
      setFilter(customDays);
      setCustomDays('');
    }
  };

  const totalOrders = ordersData.reduce((total, order) => total + order.orders, 0);
  const days = ordersData.map((order) => order.date);
  const ordersPerDay = ordersData.map((order) => order.orders);



  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Orders
        </Typography>
       
        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
          <ButtonGroup variant="outlined" size="small">
            <Button  variant={activeButton === "week" ? "contained" : "outlined"} onClick={() => {
              setFilter('week')
              setActiveButton("week") 

              }}>Week</Button>
            <Button  variant={activeButton === "month" ? "contained" : "outlined"} onClick={() => {
              setFilter('month')
              setActiveButton("month")
              }}>Month</Button>
            <Button  variant={activeButton === "year" ? "contained" : "outlined"} onClick={() => {
              setFilter('year')
              setActiveButton("year")
              }}>Year</Button>
          </ButtonGroup>
          <form onSubmit={handleCustomDaysSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              placeholder="Custom days"
              min="1"
              style={{
                width: '100px',
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Button 
              type="submit" 
              variant="outlined" 
              size="small"
              disabled={!customDays || isNaN(customDays) || parseInt(customDays) <= 0}
            >
              Apply
            </Button>
          </form>
        </Stack>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalOrders}
            </Typography>
            {/* <Chip 
            size="small" 
            color={percentageChange >= 0 ? "success" : "error"}
            label={`${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`}
          /> */}
           {/* <Chip 
            size="small" 
            color={percentageChange >= 0 ? "success" : "error"}
            label={`${percentageChange >= 0 ? '+' : ''}${Math.round(percentageChange)}%`}
          /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Orders per day for the selected period
          </Typography>
        </Stack>
        {ordersData.length > 0 && (
          <LineChart
            colors={colorPalette}
            xAxis={[
              {
                scaleType: 'band',  // Use 'band' scale for categorical data like dates
                data: days,
                tickInterval: 1,  // Show every data point
              },
            ]}
            
            series={[
              {
                id: 'orders',
                showMark: false,
                curve: 'linear',
                stack: 'total',
                area: true,
                stackOrder: 'ascending',
                data: ordersPerDay,
              },
            ]}
            height={250}
            margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiAreaElement-series-orders': {
                fill: "url('#orders')",
              },
            }}
          >
            <AreaGradient color={theme.palette.primary.main} id="orders" />
          </LineChart>
        )}
      </CardContent>
      <LoadingDialog open={loading} />
    </Card>
  );
}

// import * as React from 'react';
// import PropTypes from 'prop-types';
// import { useTheme } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Chip from '@mui/material/Chip';
// import Typography from '@mui/material/Typography';
// import Stack from '@mui/material/Stack';
// import { LineChart } from '@mui/x-charts/LineChart';

// function AreaGradient({ color, id }) {
//   return (
//     <defs>
//       <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
//         <stop offset="0%" stopColor={color} stopOpacity={0.5} />
//         <stop offset="100%" stopColor={color} stopOpacity={0} />
//       </linearGradient>
//     </defs>
//   );
// }

// AreaGradient.propTypes = {
//   color: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
// };

// function getDaysInMonth(month, year) {
//   const date = new Date(year, month, 0);
//   const monthName = date.toLocaleDateString('en-US', {
//     month: 'short',
//   });
//   const daysInMonth = date.getDate();
//   const days = [];
//   let i = 1;
//   while (days.length < daysInMonth) {
//     days.push(`${monthName} ${i}`);
//     i += 1;
//   }
//   return days;
// }

// export default function SessionsChart() {
//   const theme = useTheme();
//   const data = getDaysInMonth(4, 2024);

//   const colorPalette = [
//     theme.palette.primary.light,
//     theme.palette.primary.main,
//     theme.palette.primary.dark,
//   ];

//   return (
//     <Card variant="outlined" sx={{ width: '100%' }}>
//       <CardContent>
//         <Typography component="h2" variant="subtitle2" gutterBottom>
//           Sessions
//         </Typography>
//         <Stack sx={{ justifyContent: 'space-between' }}>
//           <Stack
//             direction="row"
//             sx={{
//               alignContent: { xs: 'center', sm: 'flex-start' },
//               alignItems: 'center',
//               gap: 1,
//             }}
//           >
//             <Typography variant="h4" component="p">
//               13,277
//             </Typography>
//             <Chip size="small" color="success" label="+35%" />
//           </Stack>
//           <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//             Sessions per day for the last 30 days
//           </Typography>
//         </Stack>
//         <LineChart
//           colors={colorPalette}
//           xAxis={[
//             {
//               scaleType: 'point',
//               data,
//               tickInterval: (index, i) => (i + 1) % 5 === 0,
//             },
//           ]}
//           series={[
//             {
//               id: 'direct',
//               label: 'Direct',
//               showMark: false,
//               curve: 'linear',
//               stack: 'total',
//               area: true,
//               stackOrder: 'ascending',
//               data: [
//                 300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800, 3300,
//                 3600, 3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800, 5700, 6000,
//                 6300, 6600, 6900, 7200, 7500, 7800, 8100,
//               ],
//             },
//             // {
//             //   id: 'referral',
//             //   label: 'Referral',
//             //   showMark: false,
//             //   curve: 'linear',
//             //   stack: 'total',
//             //   area: true,
//             //   stackOrder: 'ascending',
//             //   data: [
//             //     500, 900, 700, 1400, 1100, 1700, 2300, 2000, 2600, 2900, 2300, 3200,
//             //     3500, 3800, 4100, 4400, 2900, 4700, 5000, 5300, 5600, 5900, 6200,
//             //     6500, 5600, 6800, 7100, 7400, 7700, 8000,
//             //   ],
//             // },
//             // {
//             //   id: 'organic',
//             //   label: 'Organic',
//             //   showMark: false,
//             //   curve: 'linear',
//             //   stack: 'total',
//             //   stackOrder: 'ascending',
//             //   data: [
//             //     1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800, 2500,
//             //     3000, 3400, 3700, 3200, 3900, 4100, 3500, 4300, 4500, 4000, 4700,
//             //     5000, 5200, 4800, 5400, 5600, 5900, 6100, 6300,
//             //   ],
//             //   area: true,
//             // },
//           ]}
//           height={250}
//           margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
//           grid={{ horizontal: true }}
//           sx={{
//             '& .MuiAreaElement-series-organic': {
//               fill: "url('#organic')",
//             },
//             '& .MuiAreaElement-series-referral': {
//               fill: "url('#referral')",
//             },
//             '& .MuiAreaElement-series-direct': {
//               fill: "url('#direct')",
//             },
//           }}
//           slotProps={{
//             legend: {
//               hidden: true,
//             },
//           }}
//         >
//           <AreaGradient color={theme.palette.primary.dark} id="organic" />
//           <AreaGradient color={theme.palette.primary.main} id="referral" />
//           <AreaGradient color={theme.palette.primary.light} id="direct" />
//         </LineChart>
//       </CardContent>
//     </Card>
//   );
// }
