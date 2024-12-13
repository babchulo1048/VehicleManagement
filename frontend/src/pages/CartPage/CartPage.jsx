import React, { useState, useEffect, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, IconButton, Box,MenuItem, FormControl, InputLabel,Select } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {removeFromCart,increaseQuantity,updateCart } from '../../redux/features/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { axiosInstance } from '../../config/api';
import LoadingDialog from '../../components/LoadingDialog';
import swal from 'sweetalert';
import useThemeStore from '../../hook/zustand';
import CartReview from './CartReview';
import RateReviewIcon from '@mui/icons-material/RateReview';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const userId = localStorage.getItem('targetId');
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currency, setCurrency] = useState('usd'); // Default to USD

  // Handle currency change
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  
  const [totalPrices, setTotalPrices] = useState({});


  console.log("totalPrices:",totalPrices)

  console.log("cartItems:", cartItems);
console.log("userId:", userId);

const calculateTotalPrice = (item) => {
  // Just return the price of the item (assuming it's already calculated with quantity)
  return Number(item?.price) || 0;
};

useEffect(() => {
  // Create an object to store the total price for each item in the cart
  const newTotalPrices = {};

  // Iterate over each item in the cart and add its price
  cartItems.forEach(item => {
    newTotalPrices[item.id] = calculateTotalPrice(item);
  });

  // Update the state with the new total prices
  setTotalPrices(newTotalPrices);
}, [cartItems]);

// Calculate the total price for all items in the cart (simply adding prices)
const totalPrice = cartItems.reduce((total, item) => {
  // Add the price of the current item to the running total
  return total + calculateTotalPrice(item);
}, 0);

console.log("totalPrice:",totalPrice)
const convertedPrice = currency === 'usd'
? totalPrice
: totalPrice * 0.95;

// Optionally, you can format the total price if needed
console.log(`Total Price of all items in cart: ${totalPrice.toFixed(2)} ETB`);

  const handleIncrease = (id) => {
    console.log("id:",id)
    const item = cartItems.find((item) => item.uniqueId === id);
    const uniqueId= item?.uniqueId
    
    dispatch(increaseQuantity({ uniqueId }));
  };
  
  const handleDecrease = (itemId) => {
    const item = cartItems.find((item) => item.uniqueId === itemId);
    const uniqueId= item?.uniqueId
    
    if (item.quantity > 1) {
      dispatch(updateCart({ uniqueId, quantity: item.quantity - 1,price:item.price }));
    } else {
      dispatch(removeFromCart(item)); // Remove item if quantity is 1
    }
  };
  
  

  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenDialog = (item) => {
    console.log("item55:",item)
    
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleRemoveItem =  (id) => {
    console.log("id:",id)
    dispatch(removeFromCart({uniqueId:id}));

  }

  const stripePromise = loadStripe('pk_test_51QI7x9CTB2k8LIvHvkwASFZ8HT6aRCjKjAVp8pCMjAHDDmHz5JiWBwh9zelkjLQQayZnXZnV64MnWgEAVSOWGYpV00f9FXzPks')

  const makePayments = async () => {
    setLoading(true);
    try {
        // Validate cart items
        if (!cartItems?.length) {
            throw new Error('Your cart is empty');
        }

        // Validate user
        if (!userId) {
            throw new Error('Please log in to continue');
        }

        const stripe = await stripePromise;
        if (!stripe) {
            throw new Error('Failed to initialize payment system');
        }

        const products = cartItems.map((item) => ({
            name: item.name,
            image_url: item.image_url,
            price: item.price,
            quantity: item.quantity,
            description: item.description,
            category_name: item.category_name,
            category_id: item.category_id,
            availability: item.availability,
            menu_item_id: item.id
        }));

        // Add request interceptor to check for token expiration
        axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    // Handle token expiration
                    localStorage.removeItem('token'); // or however you handle auth
                    window.location.href = '/login'; // or your login route
                }
                return Promise.reject(error);
            }
        );

        // console.log("products:",products)

        const response = await axiosInstance.post(`/orders/checkout/${userId}`, { products,currency });
        
        if (!response.data?.id) {
            throw new Error('Invalid response from server');
        }

        const { error } = await stripe.redirectToCheckout({
            sessionId: response.data.id
        });

        if (error) {
            throw new Error(error.message);
        }

    } catch (error) {
        console.error('Checkout error:', error);
        
        let errorMessage = 'Payment failed. Please try again later.';
        
        // More specific error messages based on error type
        if (error.response?.status === 401) {
            errorMessage = 'Session expired. Please log in again.';
        } else if (error.response?.status === 400) {
            errorMessage = error.response.data.message || 'Invalid request. Please check your cart.';
        } else if (!navigator.onLine) {
            errorMessage = 'No internet connection. Please check your network.';
        }

        swal({
            title: 'Payment Failed',
            text: errorMessage,
            icon: 'error',
        });

        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Detailed error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                // products: products
            });
        }
    } finally {
        setLoading(false);
    }
};

const columns = useMemo(
  () => [
    {
      accessorKey: 'image', // This will access the product image
      header: 'Product', // The header for the product column
      size: 150,
      Cell: ({ row }) => {
        const { image } = row.original;
    
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Product Image */}
            <img 
              src={image.url} 
              alt="Product" 
              style={{ width: '60%', height: 70, marginRight: 10 }} 
            />
          </div>
        );
      },
      showSortIcons: false,
    }
,    
    {
      id: 'quantity', // Column for quantity adjustment
      header: 'Quantity',
      size: 150,
      Cell: ({ row }) => {
        const item = row.original; // Get the item data
  
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Decrease Button */}
            <IconButton 
              color="#d3a871" 
              onClick={() => handleDecrease(item.uniqueId)}
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  backgroundColor: theme === 'light' 
                    ? 'rgba(25, 118, 210, 0.15)' 
                    : 'rgba(255,87,34,0.15)',
                },
              }}
            >
              <RemoveCircleIcon />
            </IconButton>
  
            {/* Quantity Display */}
            <Typography 
              variant="h6" 
              sx={{ 
                mx: 2, 
                minWidth: '40px', 
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {item.quantity || 1}
            </Typography>
  
            {/* Increase Button */}
            <IconButton 
              color="#d3a871" 
              onClick={() => handleIncrease(item.uniqueId)}
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  backgroundColor: 
                  theme === 'light' 
                    ? 'rgba(25, 118, 210, 0.15)' 
                    : 'rgba(255,87,34,0.15)'
                    ,
                },
              }}
            >
              <AddCircleIcon />
            </IconButton>
          </div>
        );
      },
      showSortIcons: false,
    },
    {
      accessorKey: 'originalPrice', // Column for price
      header: 'Price (ETB)',
      size: 100,
    },
    {
      accessorKey: 'total', // Column for total price
      header: 'Total (ETB)',
      size: 100,
      Cell: ({ row }) => {
        const { originalPrice, quantity,selectedIngredients, selectedSizes,price } = row.original;
        const calculateTotalPrice = () => {
          // Start with the base price of the dish
          let basePrice = Number(originalPrice) || 0;
        
          // Calculate the total price based on the selected ingredients
          const ingredientsTotal = selectedIngredients.reduce(
            (sum, ingredient) => sum + (Number(ingredient.price) || 0),
            0
          );
        
          // // Add the ingredients' price to the base price
          let totalPrice = basePrice + ingredientsTotal;
        
          // Add price of selected sizes to the total price
          const sizePrice = selectedSizes.reduce(
            (sum, size) => sum + (Number(size.size_price) || 0),
            0
          );
          totalPrice += sizePrice;
        
          // Multiply by quantity
          totalPrice *= quantity;
        
          return totalPrice;
        };
        
        return (
        <>
        {/* <strong>{originalPrice * quantity} ETB</strong> */}
        <strong>{price}</strong>
        {/* <strong>{calculateTotalPrice()}</strong> */}
        </>
        )
      },
    },
    {
      id: 'remove', // Column for the remove button (X icon)
      accessor: 'remove', // Custom accessor for remove action
      size: 50,
      Cell: ({ row }) => (
        <Button
        onClick={() => handleRemoveItem(row.original.uniqueId)} 
          style={{ padding: 0, minWidth: 0, color: 'red' }}
        >
          <CloseIcon /> {/* X icon */}
        </Button>
      ),
      showSortIcons: false,
    },
    {
      id: 'Edit', // Column for the remove button (X icon)
      accessor: 'edit', // Custom accessor for remove action
      size: 50,
      Cell: ({ row }) => (
        <Button
        onClick={() => handleOpenDialog(row.original)}
          style={{ padding: 0, minWidth: 0, color: 'red' }}
        >
          <RateReviewIcon /> {/* X icon */}
        </Button>
      ),
      showSortIcons: false,
    }
  ],
 // No dependencies as no state management or context needed for these columns
);


const table = useMaterialReactTable({
  columns,
  data: cartItems,
  muiTablePaperProps: {
    elevation: 0, //change the mui box shadow
    //customize paper styles
    sx: {
      borderRadius: '0',
      border: '1px dashed #e0e0e0',
      backgroundColor: '#fff',
    },
  },
  mrtTheme: (theme) => ({
    baseBackgroundColor: '#fff',
  }),
});


  return (
   
    <Box sx={{ padding: '40px',backgroundColor:"#fff"}}>
  <Box sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 4}}>
  <Typography
  variant="h3"
  sx={{
    fontWeight: '500',
    color: '#444',
    mb: 1,
    my:2,
    p:2,
    fontSize: { xs: '1rem', md: '1.5rem' },
    textTransform: 'uppercase',
    fontFamily: "Roboto Slab, serif",
  }}
>
  Orders
</Typography>
<MaterialReactTable table={table} sx={{ borderRadius: '8px', overflow: 'hidden' }} />
  </Box>

  <Box sx={{
    maxWidth: '600px',
    marginLeft: 'auto', 
    backgroundColor: theme === 'light' 
      ? 'rgba(25, 118, 210, 0.04)' 
      : 'rgba(255,87,34,0.04)',
    borderRadius: 3,
    p: 4,
    border: '1px solid',
    borderColor: theme === 'light' 
      ? 'rgba(25, 118, 210, 0.2)' 
      : 'rgba(255,87,34, 0.2)'
  }}>
    <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' ,fontWeight: 'bold',
    color: '#444',
    fontSize: { xs: '1.5rem', md: '2rem' },
    textTransform: 'uppercase',
    fontFamily: "Roboto, serif",}}>
      Order Summary
    </Typography>
    

    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 4 }}>
      <Typography variant="h6" sx={{fontFamily: "Roboto, serif",color: '#444'}}>Total Items:</Typography>
      <Typography variant="h6" fontWeight="bold" color="#d3a871" sx={{fontFamily: "Roboto, serif",color: '#444'}}>{cartItems.length}</Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, px: 4 }}>
  <Typography variant="h6">Total Price:</Typography>
  <Typography variant="h5" color="#d3a871" fontWeight="bold">
    {currency === 'usd' ? '$' : '€'} {convertedPrice.toFixed(2)}
  </Typography>
</Box>

    {/* Currency Selector */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 4, px: 4 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Currency</InputLabel>
        <Select
          value={currency}
          label="Currency"
          onChange={handleCurrencyChange}
          sx={{ fontFamily: "Roboto, serif", width: 100 }}  // Adjust width here to make select smaller
        >
          <MenuItem value="usd">USD</MenuItem>
          <MenuItem value="eur">EUR</MenuItem>
        </Select>
      </FormControl>
    </Box>


    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={makePayments}
        sx={{
          backgroundColor: '#d3a871',
          py: 1.5,
          px: 3,
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '1rem',
          textTransform: 'none',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
            backgroundColor: '#CD9751'
            // theme === 'light' ? '#1565C0' : '#F4511E'
          }
        }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  </Box>

  {openDialog && (
    <CartReview dish={selectedItem} onClose={handleCloseDialog} open={openDialog}/>
  )}

  <LoadingDialog open={loading} />
</Box>

  );
};

export default CartPage;

