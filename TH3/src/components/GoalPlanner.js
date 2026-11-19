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
    <div className="card">
      <h3 className="card-title">Mục tiêu GPA</h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label htmlFor="goal-target" style={{ marginRight: '8px', fontSize: '14px', fontWeight: 600 }}>
            GPA mục tiêu:
          </label>
          <input
            id="goal-target"
            className="input-control"
            type="number"
            step="0.01"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>
        <div>
          <label htmlFor="goal-remaining" style={{ marginRight: '8px', fontSize: '14px', fontWeight: 600 }}>
            Số tín chỉ còn lại:
          </label>
          <input
            id="goal-remaining"
            className="input-control"
            type="number"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          borderLeft: '4px solid #3b82f6',
          fontWeight: 600,
          fontSize: '15px',
        }}
      >
        {resultText}
      </div>
    </div>
  );
};

export default GoalPlanner;
