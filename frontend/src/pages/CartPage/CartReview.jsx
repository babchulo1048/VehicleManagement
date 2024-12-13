import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, Typography, IconButton, Box, Button, ListItem, ListItemText, Radio,Checkbox } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StarIcon from '@mui/icons-material/Star';
import { addToCart, updateCart } from '../../redux/features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../config/api';

const CartReview = ({ open, onClose, dish }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [initialSelectedIngredients, setInitialSelectedIngredients] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [id, setId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);  // State for selected size

  useEffect(() => {
    if (dish) {
      console.log("dish:", dish);
      setId(dish.id);
      setQuantity(dish.quantity);
      setSelectedIngredients(dish.selectedIngredients || []);
      setInitialSelectedIngredients(dish.selectedIngredients || []);
      setSelectedSize(dish.selectedSizes || null);  // Initialize selected size
    }
  }, [dish]);

  const calculateTotalPrice = () => {
    let basePrice = Number(dish?.originalPrice) || 0;
    const ingredientsTotal = selectedIngredients.reduce(
      (sum, ingredient) => sum + (Number(ingredient.price) || 0),
      0
    );

    let totalPrice = basePrice + ingredientsTotal;

    // Add price of selected size to the total price
    if (selectedSize) {
      totalPrice += Number(selectedSize.size_price) || 0;
    }

    totalPrice *= quantity;

    return totalPrice;
  };

  const totalPrice = calculateTotalPrice();

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

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAddOrUpdateCart = () => {
    const itemInCart = cartItems.find(item => item.uniqueId === dish?.uniqueId);
    const uniqueId = dish?.uniqueId;

    const newItem = {
      id: dish.id,
      uniqueId,
      quantity,
      price: totalPrice,
      selectedIngredients,
      selectedSize,  // Include selected size in the item
      name: dish.name,
      image: dish.image,
      category_id: dish.category_id,
      category_name: dish.category_name,
      description: dish.description,
      availability: true,
    };

    if (itemInCart) {
      dispatch(updateCart({ uniqueId, quantity, selectedIngredients, selectedSize, price: newItem.price }));
      onClose();
    } 
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogContent>
        <ListItem key={dish.id}>
          <img 
            src={dish.image.url} 
            alt={dish.name}
            style={{ width: '160px', height: '150px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
          />
          <div style={{ flex: 1 }}>
            <ListItemText
              primary={dish.name}
              secondary={`Base Price: $${dish.price}`}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              {[...Array(5)].map((_, index) => (
                <StarIcon 
                  key={index} 
                  sx={{ color: index < dish.rating ? '#FFB400' : '#ddd', fontSize: '20px', marginRight: '2px' }}
                />
              ))}
            </Box>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Typography variant="body1" sx={{ margin: '0 6px', fontWeight: 'bold' }}>
                Quantity: {quantity}
              </Typography>
            </div>
          </div>
        </ListItem>

        {dish.sizes && dish.sizes.some(size => size.size_name !== null && size.size_price !== null) && (
          <Box sx={{ marginTop: '16px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Choose Size:</Typography>
            {dish.sizes
              .filter(size => size.size_name !== null && size.size_price !== null)
              .map((size) => (
                <Box key={size.size_name} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Radio
                    checked={selectedSize?.size_name === size.size_name}
                    onChange={() => handleSizeChange(size)}
                    value={size.size_name}
                    name="size-radio"
                    size="small"
                  />
                  <Typography variant="body2">{size.size_name} (+${size.size_price})</Typography>
                </Box>
              ))}
          </Box>
        )}

        {ingredients.length > 0 && (
          <Typography variant="subtitle1" sx={{ marginTop: '16px', fontWeight: 'bold' }}>
            Ingredients:
          </Typography>
        )}
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

        <Typography variant="body1" sx={{ marginTop: '20px', fontWeight: 'bold', color: '#007bff' }}>
          Total Price: ${totalPrice.toFixed(2)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleAddOrUpdateCart}>
          Update Cart
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartReview;