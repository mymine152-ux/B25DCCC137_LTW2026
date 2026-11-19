const COURSES_KEY = 'ltw_sodiem_courses';

export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const saveCourses = (courses) => {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Failed to save courses:', e);
  }
};

