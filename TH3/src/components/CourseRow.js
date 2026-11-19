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
      <td style={{ textAlign: 'center' }}>{course.credits}</td>
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
          style={{ width: '65px', padding: '4px' }}
        />
      </td>
      <td>{isF ? 'F – Học lại' : gradeInfo.letter}</td>
      <td>{formatPoint(gradeInfo.point)}</td>
      <td style={{ textAlign: 'center' }}>{renderCountRef.current}</td>
      <td>
        <button
          onClick={() => onRemove(course.id, course.name)}
          className="btn btn-danger"
          style={{ padding: '3px 8px', fontSize: '12px' }}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default React.memo(CourseRow);
