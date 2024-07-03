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
    addBacklogChecklistItem(state, action) {
      const { backlogIndex, checklistItem } = action.payload;
      if (backlogIndex < state.backlogs.length) {
        state.backlogs[backlogIndex].checklist.push(checklistItem);
      }
    },
    removeBacklogChecklistItem(state, action) {
      const { backlogIndex, checklistIndex } = action.payload;
      if (backlogIndex < state.backlogs.length) {
        state.backlogs[backlogIndex].checklist = state.backlogs[backlogIndex].checklist.filter(
          (_, index) => index !== checklistIndex
        );
      }
    },
    toggleBacklogChecklistItem(state, action) {
      const { backlogIndex, checklistIndex } = action.payload;
      if (backlogIndex < state.backlogs.length && checklistIndex < state.backlogs[backlogIndex].subTask.length) {
        state.backlogs[backlogIndex].subTask[checklistIndex].completed = 
          !state.backlogs[backlogIndex].subTask[checklistIndex].completed;
      }
    },
  },
});

export const {
  setBacklog,
  addBacklog,
  removeBacklog,
  updateBacklog,
  moveBacklogTask,
  addBacklogChecklistItem,
  toggleBacklogChecklistItem,
  removeBacklogChecklistItem
} = backlogSlice.actions;

export default backlogSlice.reducer;
