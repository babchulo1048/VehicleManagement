import React, { useState, useEffect, useCallback, useMemo } from 'react';
import StatisticsCard from '../../components/cards/StatisticsCards';
import Grid from '@mui/material/Grid';
import MDBox from '../../components/MDBox';
import MDTypography from '../../components/MDTypography';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerticalBarChart from '../../components/charts/verticalBarChart';
import PieChart from '../../components/charts/pieChart';
import Card from '@mui/material/Card';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Container, useMediaQuery, Select, MenuItem,Typography } from '@mui/material';
import useThemeStore from '../../hook/zustand';
import { axiosInstance } from '../../config/api';
import LoadingDialog from '../../components/LoadingDialog';
// import Grid from '@mui/material/Grid2';

const Dashboard = () => {
  const [data, setData] = useState({});
  const { theme, toggleTheme } = useThemeStore();
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin-dashboard');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const topProducts = data?.topMenuItems || [];

  const total2 = [
    {
      label: "Total Revenue",
      count: data?.orderCounts?.totalRevenue,
      icon: <AttachMoneyIcon />,
      color: "success",
    },
    {
      label: "Total Orders",
      count: data?.orderCounts?.totalOrders,
      icon: <ShoppingCartIcon />,
      color: "info",
    },
    {
      label: "Total Products",
      count: data?.orderCounts?.totalMenuItems,
      icon: <RestaurantIcon />,
      color: "warning",
    },
  ];

  // const salesData = data?.monthlyRevenueData || {};
  const salesData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Revenue',
        color: 'info',
        data: [
          59315.47, 63412.35, 71234.89, 56123.55, 67012.43, 75023.60, 80000.00, 65000.10,
          71000.00, 72000.25, 68000.75, 79000.90
        ],
      },
    ],
  };
  
  <VerticalBarChart
    icon={{ color: 'primary', component: 'leaderboard' }}
    title="Revenue Over Time"
    description="Annual Revenue Growth"
    chart={salesData}
  />
  const productData = data?.orderStatusData || {};

  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'Order ID', size: 100 },
    { accessorKey: 'user_name', header: 'Customer Name', size: 150 },
    { accessorKey: 'total_price', header: 'Total Price', size: 150 },
    {
      accessorKey: 'status', header: 'Status', size: 150,
      Cell: ({ row }) => <span>{row.original.status}</span>
    },
    {
      accessorKey: 'action', header: 'Action', size: 150,
      Cell: ({ row }) => (
        <Select
          defaultValue={row.original.status}
          onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      ),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: data?.recentOrders || [],
  });

  return (
    <Box>
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        paddingBlock: 4,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
        color: theme === 'dark' ? '#ffffff' : '#000000',
      }}>
        <Grid container spacing={3}>
          {/* Main content */}
          <Grid item xs={12} lg={9}>
            {/* Statistics Cards Row */}
            <Grid container spacing={3} mb={3}>
              {total2.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MDBox>
                    <StatisticsCard
                      color={item.color}
                      icon={item.icon}
                      title={item.label}
                      count={item.count}
                    />
                  </MDBox>
                </Grid>
              ))}
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Box sx={{ height: '400px' }}>
                  <VerticalBarChart
                    icon={{ color: "primary", component: "leaderboard" }}
                    title="Revenue Over Time"
                    description="Annual Revenue Growth"
                    chart={salesData}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Box sx={{ height: '400px' }}>
                  <PieChart
                    icon={{ color: "info", component: "group" }}
                    title="Order Status"
                    description="A breakdown of order statuses"
                    chart={productData}
                  />
                  
                </Box>
              </Grid>
            </Grid>

            {/* Orders Table */}
          
          </Grid>

          {/* Top Products */}
          <Grid item xs={12} lg={3}>
            <Card sx={{
              backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
              maxHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
            }}>
                  <Box p={3} sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff', borderRadius: '12px' }}>
      <Typography variant="h6" mb={2} color={theme === 'dark' ? 'white' : 'text.primary'} fontWeight="bold">
        Top Products
      </Typography>
      <Box
        sx={{
          // maxHeight: '5', // Set a max height to control the scrollable area
          // overflowY: 'auto', // Enable vertical scrolling when the content exceeds maxHeight
        }}
      >
        {topProducts.map((product, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              mb: 1.5,
              backgroundColor: theme === 'dark' ? '#3d3d3d' : '#f9f9f9',
              borderRadius: '10px',
              boxShadow: theme === 'dark' ? 'none' : '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#4f4f4f' : '#e0e0e0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" fontWeight="medium" color='info' sx={{ marginRight: 1 }}>
                {product.item_name}
              </Typography>
            </Box>
            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.secondary'}>
              {product.total_quantity_ordered} units
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
            </Card>
          </Grid>
        </Grid>
         <Grid container spacing={3}>
  <Grid container spacing={3} mt={3}>
              <Grid item xs={12}>
                <Box sx={{ overflow: 'auto',padding:4 }}>
                  <Typography variant="h5" sx={{ marginBottom: '20px',  }}>
                    Recent Orders
                  </Typography>
                  <MaterialReactTable
                    table={table}
                    enableFullScreenToggle
                    initialState={{ density: isLargeScreen ? 'comfortable' : 'compact' }}
                    muiTableContainerProps={{ sx: { maxHeight: '500px',backgroundColor:"#fff" } }}
                  />
                </Box>
              </Grid>
            </Grid>
         </Grid>
      </Box>
      <LoadingDialog open={loading} />
    </Box>
  );
};

export default Dashboard;
