import { configureStore } from '@reduxjs/toolkit';
import componentReducer from './componentSlice';
import todoReducer from './todoSlice';
import backlogReducer from "./backlogSlice";
import inProgressReducer from "./inprogressSlice";
import doneReducer from "./doneSlice";


export default configureStore({
  reducer: {
    component: componentReducer,
    todo: todoReducer,
    backlog: backlogReducer,
    inProgress: inProgressReducer,
    done: doneReducer,
  },
});