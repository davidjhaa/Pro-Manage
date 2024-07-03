import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  done: [],
};

const doneSlice = createSlice({
  name: "done",
  initialState,
  reducers: {
    setDone(state, action) {
      state.done = action.payload;
    },
    addDone(state, action) {
      state.done.push(action.payload);
    },
    removeDone(state, action) {
      state.done = state.done.filter((_, index) => index !== action.payload);
    },
    updateDone(state, action) {
      const { task, index } = action.payload;
      if (index < state.done.length) {
        state.done[index] = task;
      }
    },
    moveDoneTask(state, action) {
      state.done = state.done.filter((_, index) => index !== action.payload.index);
    },
    toggleDoneChecklistItem(state, action) {
      const { doneIndex, checklistIndex } = action.payload;
      if (doneIndex < state.done.length && checklistIndex < state.done[doneIndex].subTask.length) {
        state.done[doneIndex].subTask[checklistIndex].completed = 
          !state.done[doneIndex].subTask[checklistIndex].completed;
      }
    },
  },
});

export const {
  setDone,
  addDone,
  removeDone,
  updateDone,
  toggleDoneChecklistItem,
  moveDoneTask,
} = doneSlice.actions;

export default doneSlice.reducer;
