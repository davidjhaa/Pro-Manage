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
    addProgressChecklistItem(state, action) {
      const { inprogressIndex, checklistItem } = action.payload;
      if (inprogressIndex < state.inProgress.length) {
        state.inProgress[inprogressIndex].checklist.push(checklistItem);
      }
    },
    removeProgressChecklistItem(state, action) {
      const { inprogressIndex, checklistIndex } = action.payload;
      if (inprogressIndex < state.inProgress.length) {
        state.inProgress[inprogressIndex].checklist = state.inProgress[inprogressIndex].checklist.filter(
          (_, index) => index !== checklistIndex
        );
      }
    },
    toggleProgressChecklistItem(state, action) {
      const { inprogressIndex, checklistIndex } = action.payload;
      if (inprogressIndex < state.inProgress.length && checklistIndex < state.inProgress[inprogressIndex].subTask.length) {
        state.inProgress[inprogressIndex].subTask[checklistIndex].completed = 
          !state.inProgress[inprogressIndex].subTask[checklistIndex].completed;
      }
    },
    
  },
});

export const {
  setInProgress,
  addInProgress,
  removeInProgress,
  updateInProgress,
  addProgressChecklistItem,
  removeProgressChecklistItem,
  toggleProgressChecklistItem,
  moveInProgressTask,
} = inProgressSlice.actions;

export default inProgressSlice.reducer;
