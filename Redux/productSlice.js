import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    addProducts(state, action) {
      state.push(action.payload);
      console.log(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addProducts } = productSlice.actions;
export default productSlice.reducer;
