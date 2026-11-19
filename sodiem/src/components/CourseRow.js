import React, { useRef } from 'react';
import { formatPoint } from '../data';
import { getGrade } from '../utils';

const CourseRow = ({ course, onScore, onRemove }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const gradeInfo = getGrade(course.score);
  const isF = gradeInfo.letter === 'F';

  return (
    <tr
      style={{
        color: isF ? '#c62828' : 'inherit',
        backgroundColor: isF ? 'rgba(198, 40, 40, 0.05)' : 'transparent',
      }}
    >
      <td>{course.code}</td>
      <td>{course.name}</td>
      <td>{course.credits}</td>
      <td>{course.semester}</td>
      <td>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          aria-label={`Điểm ${course.name}`}
          value={course.score}
          onChange={(e) => {
            const val = e.target.valueAsNumber;
            if (!isNaN(val) && val >= 0 && val <= 10) {
              onScore(course.id, val);
            }
          }}
          style={{ width: '70px', padding: '4px 6px' }}
        />
      </td>
      <td>{isF ? 'F – Học lại' : gradeInfo.letter}</td>
      <td>{formatPoint(gradeInfo.point)}</td>
      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{renderCountRef.current}</td>
      <td>
        <button
          onClick={() => onRemove(course.id, course.name)}
          style={{
            padding: '4px 10px',
            backgroundColor: '#d32f2f',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default React.memo(CourseRow);

