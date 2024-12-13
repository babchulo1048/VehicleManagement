import React, { useState, useEffect, useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MenuItem, Select, Button, Rating, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { axiosInstance } from '../../config/api'; // Import axios for making API calls
import swal from 'sweetalert';
import LoadingDialog from '../../components/LoadingDialog';

const ViewOrders = ({ menuItems, openView, onClose,  }) => {
  const userId = localStorage.getItem('targetId');
    const [orderItems, setOrderItems] = useState([]);
    const [openRatingModal, setOpenRatingModal] = useState(false); // State to control modal visibility
    const [selectedMenuItem, setSelectedMenuItem] = useState(null); // Store selected menu item for rating
    const [rating, setRating] = useState(0); // Rating state
    const [review, setReview] = useState(''); // Review text state
    const [orderId, setOrderId] = useState(''); // Order ID state
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (menuItems) {
            setOrderItems(menuItems?.items);
            setOrderId(menuItems.id);
        }
    }, [menuItems]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'menu_item_id', // Column for menu item ID
                header: 'Menu Item ID',
                size: 100,
            },
            {
                accessorKey: 'item_name', 
                header: 'Item Name',
                size: 150,
            },
            {
                accessorKey: 'quantity', 
                header: 'Quantity',
                size: 100,
            },
            {
                accessorKey: 'price',
                header: 'Price',
                size: 100,
                Cell: ({ row }) => (
                    <span>${row?.original?.price?.toFixed(2)}</span> // Format price
                ),
            },
          
        ],
        []
    );


    const table = useMaterialReactTable({
        columns,
        data: Array.isArray(orderItems) ? orderItems : [], // Ensure it's an array
    });
    

    // Open rating modal
    const openRatingModalHandler = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setOpenRatingModal(true);
    };

    // Close rating modal
    const closeRatingModalHandler = () => {
        setOpenRatingModal(false);
        setRating(0);
        setReview('');
    };

    // Handle rating and review submission
    const submitRating = async () => {
      const formData ={
        user_id: userId,
        order_id: orderId,
        menu_item_id: selectedMenuItem.menu_item_id,
        rating,
        review,
      }

      setLoading(true)
        try {
            const response = await axiosInstance.post('/ratings', formData);

            if (response.status === 201) {
              swal({
                title: 'Rating Successfull!',
                icon: 'success',
              });
              setOpenRatingModal(false);
              setRating(0);
              setReview('');
              }
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={openView} onClose={onClose} maxWidth="md">
                <DialogTitle textAlign="center">Menu Items</DialogTitle>
                <DialogContent>
                    <MaterialReactTable table={table} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Rating Modal */}
            <Dialog open={openRatingModal} onClose={closeRatingModalHandler}>
                <DialogTitle>Rate {selectedMenuItem?.item_name}</DialogTitle>
                <DialogContent>
                    <div>
                        {/* Star rating component */}
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(e, newValue) => setRating(newValue)}
                            size="large"
                        />
                    </div>
                    <TextField
                        label="Review"
                        multiline
                        rows={4}
                        fullWidth
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeRatingModalHandler}>Cancel</Button>
                    <Button onClick={submitRating} color="primary">
                        Submit Rating
                    </Button>
                </DialogActions>
            </Dialog>
            <LoadingDialog open={loading} />
        </>
    );
};

export default ViewOrders;
