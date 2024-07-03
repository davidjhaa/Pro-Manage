import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  backlogs: [],
};

const backlogSlice = createSlice({
  name: "backlog",
  initialState,
  reducers: {
    setBacklog(state, action) {
      state.backlogs = action.payload;
    },
    addBacklog(state, action) {
      state.backlogs.push(action.payload);
    },
    removeBacklog(state, action) {
      state.backlogs = state.backlogs.filter((_, index) => index !== action.payload);
    },
    updateBacklog(state, action) {
      const { task, index } = action.payload;
      if (index < state.backlogs.length) {
        state.backlogs[index] = task;
      }
    },
    moveBacklogTask(state, action) {
      state.backlogs = state.backlogs.filter((_, index) => index !== action.payload.index);
    },
  },
});

export const {
  setBacklog,
  addBacklog,
  removeBacklog,
  updateBacklog,
  moveBacklogTask,
} = backlogSlice.actions;

export default backlogSlice.reducer;
