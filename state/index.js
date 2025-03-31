import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSideBarCollapsed: false,
  isDarkMode: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSideBarCollapsed: (state, action) => {
      state.isSideBarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsSideBarCollapsed, setIsDarkMode } = globalSlice.actions;

export default globalSlice.reducer;
