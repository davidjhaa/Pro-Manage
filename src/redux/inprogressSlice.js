import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inProgress: [],
};

const inProgressSlice = createSlice({
  name: "inProgress",
  initialState,
  reducers: {
    setInProgress(state, action) {
      state.inProgress = action.payload;
    },
    addInProgress(state, action) {
      state.inProgress.push(action.payload);
    },
    removeInProgress(state, action) {
      state.inProgress = state.inProgress.filter((_, index) => index !== action.payload);
    },
    updateInProgress(state, action) {
      const { task, index } = action.payload;
      if (index < state.inProgress.length) {
        state.inProgress[index] = task;
      }
    },
    
  },
});

export const {
  setInProgress,
  addInProgress,
  removeInProgress,
  updateInProgress,
  moveInProgressTask,
} = inProgressSlice.actions;

export default inProgressSlice.reducer;
