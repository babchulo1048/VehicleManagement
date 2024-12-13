import React, { useEffect, useState,useMemo, useCallback } from 'react';
import { Container, Typography, Button, MenuItem,Box  } from '@mui/material';
import Menu from '@mui/material/Menu';
import { axiosInstance } from '../../config/api';
import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewOrders from './viewOrders';
import LoadingDialog from '../../components/LoadingDialog';

import socket from '../../hook/SocketContext';
import StarIcon from '@mui/icons-material/Star';
import RatePage from './RatePage';

const UserOrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false); // State to control the dialog visibility
    const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order details
    const targetId = localStorage.getItem('targetId');
    const [menuItems, setMenuItems] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [openView2, setOpenView2] = useState(false);


    const handleViewDetails = (data) => {
         
        setMenuItems(data);
      
        setOpenView(true);
        
      }
      const handleRate = (data) => {
         
        setMenuItems(data);
      
        setOpenView2(true);
        
      }

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/orders/user/${targetId}`);
            setOrders(response.data);
        } catch (err) {
            setError('Error fetching orders',err.response);
        } finally {
            setLoading(false);
        }
    },[]);


    socket.on('newOrder', () => {
      fetchOrders();
    })

    const handleCloseDialog = () => {
      setOpenView(false);
      setOpenView2(false);
        }

    useEffect(() => {
        // Fetch user's orders from the backend
    

        fetchOrders();
    }, []);

    useEffect(() => {
        socket.on('updateOrderStatusResponse', (data) => {
           fetchOrders()
        })

        return () => {
            socket.off('updateOrderStatusResponse');
        };
    },[])

    useEffect(() => {
      socket.on('newOrder', (data) => {
         fetchOrders()
      })

      return () => {
          socket.off('newOrder');
      };
  },[])



    const columns = useMemo(
        () => [
            {    id: 'action',
                accessor: 'action',
                header: '',
                size:40,
                Cell: ({ row }) => (
                  <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <Button color='#444' {...bindTrigger(popupState)} style={{ padding: 0, minWidth: 0 }}>
                      <MoreVertIcon />
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                   
                      
                      <MenuItem onClick={() => {
                        handleViewDetails(row.original);
                        popupState.close();
                      }} style={{ color: '#1976d2' }}>
                        <VisibilityIcon style={{ marginRight: 8 }} /> View Details
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleRate(row.original);
                        popupState.close();
                      }}  style={{ color: '#A2A206' }}>
                        <StarIcon style={{ marginRight: 8 }} /> Rate
                      </MenuItem>
               
                     </Menu>
                  </React.Fragment>
                )}
              </PopupState>
                ),
                showSortIcons: false,
                
                
              },
          {
            accessorKey: 'id', // Column for order ID
            header: 'Order ID',
            size: 100,
          },
          {
            accessorKey: 'total_price', // Column for total price
            header: 'Total Price',
            size: 150,
            PlaceholderCell: ({ row }) => {
              console.log("row:",row.original)
                const currency = row.original.currency; // Assuming `currency` is a field in your data
                const totalPrice = row.original.total_price;
        
                // Determine the currency symbol
                const currencySymbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : '';
        
                return (
                    <span>
                        {currencySymbol}{totalPrice.toFixed(2)} {currency.toUpperCase()}
                    </span>
                );
            },
        }
,        

{
  accessorKey: 'currency', // Column for customer name
  header: 'Currency',
  size: 150,
},
          {
            accessorKey: 'user_name', // Column for customer name
            header: 'Customer Name',
            size: 150,
          },
          
          {
            accessorKey: 'status', // Column for order status
            header: 'Status',
            size: 100,
          },
          {
            accessorKey: 'created_at', // Column for creation date
            header: 'Created At',
            size: 150,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(), // Format the date
          },
        ],
        []
      );
      
      // Set up the table with columns and fetched data
      const table = useMaterialReactTable({
        columns,
        data: orders,
        enableCellActions: true,
        mrtTheme: (theme) => ({
          baseBackgroundColor: '#fff',
        }), 
      });
      

    const handleOpen = (order) => {
        setSelectedOrder(order); // Set selected order
        setOpen(true); // Open dialog
    };

    const handleClose = () => {
        setOpen(false); // Close dialog
        setSelectedOrder(null); // Clear selected order
    };

    return (
        <Container>
          
            {orders.length === 0 ? (
                <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '300px', // Set a fixed height for the "No Orders" section
                  backgroundColor: '#f5f5f5', // Light gray background
                  borderRadius: '10px', // Rounded corners for a softer look
                  boxShadow: 2, // Light shadow for visual depth
                  padding: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: '#444', fontWeight: 'bold' }}>
                  You have no orders yet.
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h5" gutterBottom my={2}>
                Order History
            </Typography>

                <MaterialReactTable table={table} />
              </>
               
            )}

{
                menuItems && (
                  <ViewOrders menuItems={menuItems} openView={openView} onClose={handleCloseDialog}/>
                )
              }
              {
                menuItems && (
                  <RatePage menuItems={menuItems} openView={openView2} onClose={handleCloseDialog}/>
                )
              }
              <LoadingDialog open={loading} />
        </Container>
    );
};

export default UserOrderHistoryPage;




