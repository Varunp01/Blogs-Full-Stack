import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("blogifyUser");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;

      if (action.payload) {
        localStorage.setItem("blogifyUser", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("blogifyUser");
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export const getUser = setUser; // keeps your old import working if used somewhere
export default userSlice.reducer;
