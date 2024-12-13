import React, { useState,useEffect } from 'react';
import { TextField, Button,  Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'

// Sample image path (replace with your restaurant image)
import bg2 from "../../assets/bg2.jpg"
import { axiosInstance } from '../../config/api';
import swal from 'sweetalert';
// import { useSocket } from '../../hook/SocketContext';
import { useNavigate } from 'react-router-dom';
import zagwe from "../../assets/zagwee.webp"
// import io from 'socket.io-client';
import socket from '../../hook/SocketContext';

// const socket = io.connect('http://127.0.0.1:3000');



const BookTable = () => {
  const navigate = useNavigate();
  // const socket = useSocket();
    const user_id = localStorage.getItem('targetId');
  const [formData, setFormData] = useState({
    user_id,
    phone_number: '',
    number_of_people: '',
    reservation_time: '',
    special_requests: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  socket.on('bookTableResponse', () => {
    console.log('bookTableResponse called');
});



// useEffect(() => {
//   const handleResponse = ({ data }) => {
//       swal({
//           title: "Table Booked Successfully!",
//           icon: "success"
//       });
//       // Optionally fetch orders if needed
//       fetchOrders(); // Call fetchOrders if you want to refresh the order list
//   };

//   // Set up the listener for updateOrderStatusResponse
//   socket.on('updateOrderStatusResponse', handleResponse);

//   // Clean up: remove the listener when the component unmounts
//   return () => {
//       socket.off('updateOrderStatusResponse', handleResponse);
//   };
// }, [socket]);

useEffect(() => {
  const handleOrderTableResponse = (response) => {
      // Check the response status and handle it accordingly
      if (response.status === 201) {
          swal({
              title: "Success!",
              text: "Reservation created successfully!",
              icon: "success",
              button: "OK",
          });
          setFormData({
              user_id,
              phone_number: '',
              number_of_people: '',
              reservation_time: '',
              special_requests: '',
          })
      } else if (response.status === 400 || response.status === 404) {
          swal({
              title: "Error!",
              text: response.message || "Failed to create reservation.",
              icon: "error",
              button: "OK",
          });
      } else if (response.status === 500) {
          swal({
              title: "Error!",
              text: "Internal server error. Please try again later.",
              icon: "error",
              button: "OK",
          });
      }


  };

  // Listen for the `OrderTableResponse` event from the server
  socket.on('OrderTableResponse', handleOrderTableResponse);

  // Cleanup listener on component unmount
  return () => {
      socket.off('OrderTableResponse', handleOrderTableResponse);
  };
}, [socket]);

  const handleSubmit = async  (e) => {
    e.preventDefault();

    try {
        console.log("formData:",formData)
        socket.emit('bookTable', formData); 
      
        const response =await  axiosInstance.post('/book-tables', formData);
        console.log("response:",response.status)
        if (response.status === 201) {
          // Handle successful response
          swal({
            title: "Success",
            text: "Reservation submitted successfully",
            icon: "success",
            button: "OK"
          })
          console.log('Reservation submitted successfully');
          setFormData({
            phone_number: '',
            number_of_people: '',
            reservation_time: '',
            special_requests: '',
          })
        } 
    }
    catch (error) {
      console.error('Error submitting reservation:', error);
    }
    
    
  };

  return (
    <Box sx={{ padding: 4,maxWidth: '1050px', margin: '0 auto' }}>

<Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2,backgroundColor:"#C57D1E" }}
            onClick={() => navigate('/booking-list')}
          >
            Go to Booking List
          </Button>


      {/* Book Table Form Box */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Column on small screens, row on large
          marginTop: 3,
        }}
      >
        {/* Left Side: Restaurant Image */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${zagwe})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: { xs: '250px', md: '100vh' }, // Image height for small and large screens
            borderRadius: '8px',
            marginBottom: { xs: 2, md: 0 }, // Space below image on small screens
            backgroundColor: 'gray',  // Space below image on small screens
          }}
        >
          {/* <img
            src={signIn}
            alt="Login"
            style={{ borderRadius: '16px', width: '100%', height: '100%', objectFit: 'cover' }}
          /> */}
        </Box>
          

        {/* Right Side: Booking Form */}
        <Box sx={{ flex: 1, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Reservation Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
            <TextField
              label="Number of People"
              variant="outlined"
              fullWidth
              margin="normal"
              name="number_of_people"
              value={formData.number_of_people}
              onChange={handleChange}
              required
            />
            <TextField
              label="Reservation Time"
              type="datetime-local"
              variant="outlined"
              fullWidth
              margin="normal"
              name="reservation_time"
              value={formData.reservation_time}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Special Requests"
              variant="outlined"
              fullWidth
              margin="normal"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2,backgroundColor:"#C57D1E" }}>
              Submit Booking
            </Button>
          </form>
        </Box>
      </Box>
     
    </Box>
  );
};

export default BookTable;
