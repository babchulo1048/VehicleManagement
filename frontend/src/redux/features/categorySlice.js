import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCategory: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      console.log("action:",action.payload)
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null; // Clear the selected category
    },
  },
});

export const { setSelectedCategory, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
