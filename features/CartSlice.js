import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromBasket: (state, action) => {
      // state.value -= 1;

      // console.log(state);

      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let newCart = [...state.items];

      if (index >= 0) {
        newCart.splice(index, 1);
      } else {
      }

      state.items = newCart;
    },
    makeCartEmpty: (state, action) => {
      state.items = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromBasket, makeCartEmpty } = CartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsWithId = (state, id) =>
  state.cart.items.filter((item) => item.id === id);

export default CartSlice.reducer;
