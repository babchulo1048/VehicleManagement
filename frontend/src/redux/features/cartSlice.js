import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    
    addToCart: (state, action) => {
      const { id, selectedIngredients } = action.payload;
      
      // Generate a base uniqueId from item id
      let baseUniqueId = `${id}`;
    
      // Count how many times this item has been added already
      const existingItems = state.items.filter((item) => item.id === id);
      
      // If there are already items in the cart with the same id, we need to add a suffix
      let uniqueId = baseUniqueId;
      if (existingItems.length > 0) {
        // Append a suffix like "-2", "-3", etc., to the id
        uniqueId = `${baseUniqueId}-${existingItems.length + 1}`;
      }
    
      const itemIndex = state.items.findIndex((item) => item.uniqueId === uniqueId);
    
      if (itemIndex >= 0) {
        // Item exists, increase quantity
        state.items[itemIndex].quantity += 1;
      } else {
        // Item does not exist, add it with the uniqueId
        state.items.push({ ...action.payload, uniqueId });
      }
    },
    
    
    
    

    // Update cart item, used for modifying existing cart items
    // updateCart: (state, action) => {
    //   console.log("action.payload:", action.payload); // Log the incoming payload
      
    //   const { uniqueId, quantity, selectedIngredients, selectedSizes, price } = action.payload;
    
    //   // Find the item by uniqueId
    //   const itemIndex = state.items.findIndex((item) => item.uniqueId === uniqueId);
      
    //   if (itemIndex >= 0) {
    //     const item = state.items[itemIndex];
    
    //     // Log the initial price before updating
    //     console.log("Initial item price:", item.price);
    //     item.price = price;
        
    //     // Log the updated price
    //     console.log("Updated item price:", item.price);
    
    //     // Update quantity if provided
    //     if (quantity !== undefined) {
    //       item.quantity = quantity;
    //     }
    
    //     // Update selectedIngredients if provided
    //     if (selectedIngredients) {
    //       // Merge current ingredients with new ones, avoiding duplicates
    //       item.selectedIngredients = [...new Set([...item.selectedIngredients, ...selectedIngredients])];
    //     }
    
    //     // Update selectedSizes if provided
    //     if (selectedSizes) {
    //       // Merge current sizes with new ones, avoiding duplicates
    //       item.selectedSizes = [...new Set([...item.selectedSizes, ...selectedSizes])];
    //     }
    //   }
    // },
    updateCart: (state, action) => {
      const { uniqueId, quantity, selectedIngredients, selectedSizes, price } = action.payload;
    
      // Find the item by uniqueId
      const itemIndex = state.items.findIndex((item) => item.uniqueId === uniqueId);
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
    
        item.price = price; // Update price
        if (quantity !== undefined) {
          item.quantity = quantity; // Update quantity
        }
    
        // Update selectedIngredients (replace instead of merging)
        if (selectedIngredients) {
          item.selectedIngredients = selectedIngredients;
        }
    
        // Update selectedSizes (replace instead of merging)
        if (selectedSizes) {
          item.selectedSizes = selectedSizes;
        }
      }
    },
    
    
    
    

    // Increase quantity of an item
    increaseQuantity: (state, action) => {
      const { uniqueId } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.uniqueId === uniqueId);
      
      if (itemIndex >= 0) {
        // Create a new item with updated quantity
        state.items[itemIndex] = {
          ...state.items[itemIndex],
          quantity: state.items[itemIndex].quantity + 1,
          price: (state.items[itemIndex].price / state.items[itemIndex].quantity) * (state.items[itemIndex].quantity + 1)
        };
      }
    },
    
    // Remove item from cart using uniqueId
    removeFromCart: (state, action) => {
      const { uniqueId } = action.payload;
      
      const itemIndex = state.items.findIndex((item) => item.uniqueId === uniqueId); // Use uniqueId here
      if (itemIndex >= 0) {
        state.items.splice(itemIndex, 1);
      }
    },
    
  },
});

export const { addToCart, updateCart, increaseQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
