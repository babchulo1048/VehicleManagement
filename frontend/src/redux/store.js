// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice'; 
import categoryReducer from './features/categorySlice';
// import contentReducer from './features/contentSlice'

const store = configureStore({
    reducer: {
        cart: cartReducer,
        category: categoryReducer,
        // content:contentReducer
    },
});

export default store;
