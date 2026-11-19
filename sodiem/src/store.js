import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './features/coursesSlice';
import goalReducer from './features/goalSlice';
import { loadSaved, saveCourses } from './storage';

const savedCourses = loadSaved();
export const hasSaved = savedCourses !== null;

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    goal: goalReducer,
  },
  preloadedState: {
    courses: savedCourses ?? [],
  },
});

let currentCourses = store.getState().courses;
store.subscribe(() => {
  const previousCourses = currentCourses;
  currentCourses = store.getState().courses;
  if (previousCourses !== currentCourses) {
    saveCourses(currentCourses);
  }
});

