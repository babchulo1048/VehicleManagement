import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, Typography, IconButton, Box, Button, ListItem, ListItemText, Checkbox,Snackbar, Alert,Radio  } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StarIcon from '@mui/icons-material/Star';
import { addToCart } from '../../redux/features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../config/api';

const DishReview = ({ open, onClose, dish,show }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [id, setId] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState(null); // Track multiple selected sizes
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  

  useEffect(() => {
    if (dish) {
      setId(dish?.id);
    }
  }, [dish]);

  const calculateTotalPrice = () => {
    const ingredientsTotal = selectedIngredients.reduce((sum, ingredient) => sum + (Number(ingredient.price) || 0), 0);
    const basePrice = Number(dish?.price) || 0;
    const sizePrice = Number(selectedSizes?.size_price) || 0; // Use the price of the selected size
    return (basePrice + ingredientsTotal + sizePrice) * quantity; // Include size price
  };
  

  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [selectedIngredients, quantity, dish, selectedSizes]); // Add selectedSizes to dependencies

  useEffect(() => {
    const fetchToppings = async () => {
      if (!id) return;
      try {
        const toppingResponse = await axiosInstance.get(`/menu_item_toppings/${id}`);
        setIngredients(toppingResponse.data);
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    fetchToppings();
  }, [id]);

  const handleIngredientChange = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.some((item) => item.id === ingredient.id)
        ? prev.filter((item) => item.id !== ingredient.id)
        : [...prev, ingredient]
    );
  };

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => Math.max(prev - 1, 1));


  const handleAddToCart = () => {
    const newItem = {
      id: dish.id,
      quantity,
      price: totalPrice,
      originalPrice: dish.price,
      selectedIngredients,
      sizes:dish.sizes,
      selectedSizes, // Include selected sizes in the cart item
      name: dish.name,
      image: dish.image,
      category_id: dish.category_id,
      category_name: dish.category_name,
      description: dish.description,
      availability: true,
    };
    dispatch(addToCart(newItem));
    setQuantity(1);
    setSelectedIngredients([]);
    setSelectedSizes([]); // Reset selected sizes
    show();
    onClose();
  
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogContent>
        <ListItem key={dish?.id}>
          <img 
            src={dish?.image?.url} 
            alt={dish?.name}
            style={{ width: '160px', height: '150px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
          />
          <div style={{ flex: 1 }}>
            <ListItemText
              primary={dish?.name}
              secondary={`Base Price: $${dish?.price}`}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              {[...Array(5)].map((_, index) => (
                <StarIcon 
                  key={index} 
                  sx={{ color: index < dish?.rating ? '#FFB400' : '#ddd', fontSize: '20px', marginRight: '2px' }}
                />
              ))}
            </Box>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <IconButton 
                onClick={handleDecrease}
                size="small"
                sx={{ padding: '4px', color: '#d3a871' }} // Updated color
              >
                <RemoveCircleIcon />
              </IconButton>
              <Typography variant="body1" sx={{ margin: '0 6px', fontWeight: 'bold' }}>
                {quantity}
              </Typography>
              <IconButton 
                onClick={handleIncrease}
                size="small"
                sx={{ padding: '4px', color: '#d3a871' }} // Updated color
              >
                <AddCircleIcon />
              </IconButton>
            </div>
          </div>
        </ListItem>

        {/* Sizes Selection (Checkboxes for multiple selection) */}
        {dish?.sizes && 
          dish.sizes.some(size => size.size_name !== null && size.size_price !== null) && (
            <Box sx={{ marginTop: '16px' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Choose Size:</Typography>
              {/* Sizes Selection (Radio buttons for single selection) */}
              {dish?.sizes && 
                dish.sizes.some(size => size.size_name !== null && size.size_price !== null) && (
                  <Box sx={{ marginTop: '16px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Choose Size:</Typography>
                    {dish.sizes
                      .filter(size => size.size_name !== null && size.size_price !== null)
                      .map((size) => (
                        <Box key={size.size_name} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <Radio
                            checked={selectedSizes?.size_name === size.size_name}
                            onChange={() => setSelectedSizes(size)} // Directly set the selected size
                            size="small"
                          />
                          <Typography variant="body2">{size.size_name} (+${size.size_price})</Typography>
                        </Box>
                      ))}
                  </Box>
                )}

            </Box>
          )}

        {/* Ingredients */}
        {ingredients.length > 0 && <Typography variant="subtitle1" sx={{ marginTop: '16px', fontWeight: 'bold' }}>Ingredients:</Typography>}
        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
          {ingredients.map((ingredient) => (
            <ListItem key={ingredient.id} dense>
              <Checkbox
                edge="start"
                checked={selectedIngredients.some((item) => item.id === ingredient.id)}
                onChange={() => handleIngredientChange(ingredient)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={`${ingredient.name} (+$${ingredient.price})`} />
            </ListItem>
          ))}
        </Box>

        {/* Total Price */}
        <Typography variant="body1" sx={{ marginTop: '20px', fontWeight: 'bold', color: '#d3a871' }}>
          Total Price: ${totalPrice.toFixed(2) || dish.price}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button 
          variant="contained" 
          onClick={handleAddToCart}
          sx={{ backgroundColor: '#d3a871', '&:hover': { backgroundColor: '#c5975c' } }} // Updated color with hover effect
        >
          Add to Cart
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DishReview;
