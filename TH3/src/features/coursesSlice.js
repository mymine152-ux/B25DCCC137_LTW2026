import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    setCourses: (state, action) => {
      return action.payload || [];
    },
    addCourse: (state, action) => {
      const maxId = state.reduce((max, item) => (item.id > max ? item.id : max), 0);
      const newCourse = {
        ...action.payload,
        id: action.payload.id || maxId + 1,
      };
      state.push(newCourse);
    },
    removeCourse: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
    setScore: (state, action) => {
      const { id, score } = action.payload;
      const course = state.find((item) => item.id === id);
      if (course) {
        course.score = score;
      }
    },
  },
});

export const { setCourses, addCourse, removeCourse, setScore } = coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;

