import * as React from 'react';
import { useState, useEffect,useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { axiosInstance } from '../config/api';

import socket from '../hook/SocketContext';

export default function RevenueBarChart() {
  const [ordersData, setOrdersData] = useState([]);
  const [filter, setFilter] = useState('30'); // Default to 30 days filter
  const [customDays, setCustomDays] = useState(''); // State for custom days input
  const theme = useTheme();
  const [revenue, setRevenue] = useState(null);
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];
  const [activeButton, setActiveButton] = useState("month"); 
  const userId = localStorage.getItem('targetId');


  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/admin-dashboard/orders_filtered`, {
        params: { filter },
      });
      setOrdersData(response.data.orders);
      setRevenue(response.data.summary.revenueTrend.percentageChange);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },[filter])

  useEffect(() => {   
    fetchData();

    socket.on('newOrder', fetchData);
  
    // Clean up socket listener on component unmount
    return () => {
      socket.off('newOrder', fetchData);
    };
  }, [fetchData]); // Fetch data whenever the filter changes

  // Extract dates, orders, and revenues for the chart
  const dates = ordersData.map(item => item.date);
  const orders = ordersData.map(item => parseFloat(item.orders));
  const revenues = ordersData.map(item => parseFloat(item.revenue));

  // Handle custom days filter submission
  const handleCustomDaysSubmit = (e) => {
    e.preventDefault();
    if (customDays && !isNaN(customDays) && parseInt(customDays) > 0) {
      setFilter(customDays); // Set filter to custom days
    }
  };

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Total Revenue
        </Typography>
        
        {/* Filter selection options */}
        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
          <ButtonGroup variant={activeButton === "week" ? "contained" : "outlined"} size="small">
            <Button onClick={() => {
              setFilter('7')
              setActiveButton('week')
              }}>Week</Button>
            <Button variant={activeButton === "month" ? "contained" : "outlined"} onClick={() => {
              setFilter('30')
              setActiveButton('month')
              }}>Month</Button>
            <Button  variant={activeButton === "year" ? "contained" : "outlined"} onClick={() => {
              setFilter('365')
              setActiveButton('year')
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
              {/* Display total revenue for the selected filter */}
              ${revenues.reduce((total, revenue) => total + revenue, 0).toLocaleString()}
            </Typography>
            <Chip size="small" color="success" label={`${revenue && revenue.toFixed(2)}%`} /> {/* Placeholder for trend */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Total revenue for the selected period
          </Typography>
        </Stack>

        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: dates, // Use the dates from the fetched data as x-axis labels
            },
          ]}
          series={[
            {
              id: 'revenue',
              label: 'Revenue',
              data: revenues, // The dynamic revenue data
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
