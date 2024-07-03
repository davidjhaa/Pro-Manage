import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    component: 'board',
};

const componentSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setComponent: (state, action) => {
      state.component = action.payload;
    },
  },
});

export const { setComponent } = componentSlice.actions;
export const selectComponent = (state) => state.component.component;
export default componentSlice.reducer;

