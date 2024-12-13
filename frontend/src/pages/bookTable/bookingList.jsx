import React, { useState, useEffect, useCallback,useMemo } from 'react';
import { axiosInstance } from '../../config/api';  // Import your axios instance
import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';
import io from 'socket.io-client';
import { Box, Typography,Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import socket from '../../hook/SocketContext';

// const socket = io.connect('http://127.0.0.1:3000');  // Establish WebSocket connection

const BookingList = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const targetId = localStorage.getItem('targetId');  // Replace with dynamic user ID or from props if needed

    // WebSocket event listener for updates
    socket.on('updateOrderTableStatusResponse', (updatedBooking) => {
        setBookings((prevBookings) => 
            prevBookings.map((booking) =>
                booking.booking_id === updatedBooking.booking_id ? updatedBooking : booking
            )
        );
    });

    // Fetch bookings by user ID
    const fetchBookings = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/book-tables/user/${targetId}`);
            setBookings(response.data);  // Set the bookings data in the state
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }, [targetId]);

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings();  // Call the fetch function
    }, [fetchBookings]);  // Dependency array ensures the effect runs only once

    useEffect(() => {
        const handleBookTableResponse = (response) => {
            fetchBookings(); // Refresh reservations after status update
        };
    
        socket.on('updateOrderTableStatusResponse', handleBookTableResponse);
    
        return () => {
            socket.off('updateOrderTableStatusResponse', handleBookTableResponse);
        };
    }, [socket]);

    useEffect(() => {
      fetchBookings();  // Call the fetch function

      // Combined socket event listener
      const handleBookingResponse = (response) => {
          fetchBookings(); // Refresh reservations after status update
      };

      // Listen for multiple socket events
      socket.on('updateOrderTableStatusResponse', handleBookingResponse);
      socket.on('OrderTableResponse', handleBookingResponse);

      // Cleanup function to remove socket event listeners on component unmount
      return () => {
          socket.off('updateOrderTableStatusResponse', handleBookingResponse);
          socket.off('OrderTableResponse', handleBookingResponse);
      };
  }, [fetchBookings]);

    const columns = useMemo(
        () => [
          {
            accessorKey: 'booking_id', // Column for booking ID
            header: 'Booking ID',
            size: 100,
          },
          {
            accessorKey: 'user.name', // Column for the user's name (nested)
            header: 'User Name',
            size: 150,
          },
          {
            accessorKey: 'phone_number', // Column for phone number
            header: 'Phone Number',
            size: 150,
          },
          {
            accessorKey: 'number_of_people', // Column for number of people
            header: 'Number of People',
            size: 100,
          },
          {
            accessorKey: 'reservation_time', // Column for reservation time
            header: 'Reservation Time',
            size: 180,
            Cell: ({ row}) => {
                const value = row.original.reservation_time;
                return new Date(value).toLocaleString();
            }
        }
        
        
,        
          {
            accessorKey: 'special_requests', // Column for special requests
            header: 'Special Requests',
            size: 200,
          },
          {
            accessorKey: 'status', // Column for status
            header: 'Status',
            size: 100,
          },
       

        ],
        []
      );

      const table = useMaterialReactTable({
        columns,
        data: bookings,
        mrtTheme: (theme) => ({
          baseBackgroundColor: '#fff',
        }),
      });
      

    return (
        <Box sx={{minHeight:'500px',padding:'40px' }} >
              <Button 
      variant="contained" 
      color="primary" 
      sx={{ my:2 ,backgroundColor: '#d3a871', color: 'white', '&:hover': { backgroundColor: '#d3a871' } }}
      onClick={() => navigate('/book-table')}
    >
      Add
    </Button>
            <Typography variant="h5" gutterBottom sx={{   fontFamily: "Roboto, sans-serif",
    fontWeight: 400,paddingBlock:'10px',color:"#555"}}>Your Bookings</Typography>
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default BookingList;
