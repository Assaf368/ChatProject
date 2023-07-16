import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    SetSocketConnection: (state ,action) => {
      state.socket = action.payload;
    },
  },
});
export const { SetSocketConnection } = socketSlice.actions;

export default socketSlice.reducer;
