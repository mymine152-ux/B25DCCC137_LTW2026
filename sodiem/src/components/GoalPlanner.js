import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCourses } from '../features/coursesSlice';
import { selectGoal, setRemaining, setTarget } from '../features/goalSlice';
import { calcRequired } from '../utils';

const GoalPlanner = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const { target, remaining } = useSelector(selectGoal);

  const resultText = useMemo(() => {
    return calcRequired(courses, target, remaining);
  }, [courses, target, remaining]);

  return (
    <div style={{ margin: '20px 0', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Mục tiêu GPA</h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label htmlFor="goal-target" style={{ marginRight: '8px' }}>GPA mục tiêu:</label>
          <input
            id="goal-target"
            type="number"
            step="0.01"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
            style={{ width: '90px', padding: '6px' }}
          />
        </div>
        <div>
          <label htmlFor="goal-remaining" style={{ marginRight: '8px' }}>Số tín chỉ còn lại:</label>
          <input
            id="goal-remaining"
            type="number"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
            style={{ width: '90px', padding: '6px' }}
          />
        </div>
      </div>
      <div style={{ marginTop: '14px', fontWeight: 'bold', fontSize: '15px' }}>
        {resultText}
      </div>
    </div>
  );
};

export default GoalPlanner;

