import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodos(state, action) {
      state.todos = action.payload;
    },
    addTodo(state, action) {
      state.todos.push(action.payload);
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((_, index) => index !== action.payload);
    },
    updateTodo(state, action) {
      const { todo, index } = action.payload;
      if (index < state.todos.length) {
        state.todos[index] = todo;
      }
    },
    addChecklistItem(state, action) {
      const { todoIndex, checklistItem } = action.payload;
      if (todoIndex < state.todos.length) {
        state.todos[todoIndex].checklist.push(checklistItem);
      }
    },
    removeChecklistItem(state, action) {
      const { todoIndex, checklistIndex } = action.payload;
      if (todoIndex < state.todos.length) {
        state.todos[todoIndex].checklist = state.todos[todoIndex].checklist.filter(
          (_, index) => index !== checklistIndex
        );
      }
    },
    toggleChecklistItem(state, action) {
      const { todoIndex, checklistIndex } = action.payload;
      if (todoIndex < state.todos.length && checklistIndex < state.todos[todoIndex].checklist.length) {
        state.todos[todoIndex].checklist[checklistIndex].completed = 
          !state.todos[todoIndex].checklist[checklistIndex].completed;
      }
    },
    moveTodoTask(state, action) {
      state.todos = state.todos.filter((_, index) => index !== action.payload.index);
    },
  },
});

export const {
  setTodos,
  addTodo,
  removeTodo,
  updateTodo,
  addChecklistItem,
  removeChecklistItem,
  toggleChecklistItem,
  moveTodoTask,
} = todoSlice.actions;

export default todoSlice.reducer;
