import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CREDIT_OPTIONS, SEMESTERS } from '../data';
import { addCourse, selectCourses } from '../features/coursesSlice';
import { useNotice } from '../context/NoticeContext';

const AddCourseForm = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const showNotice = useNotice();

  const codeInputRef = useRef(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      newErrors.code = 'Hãy nhập mã môn';
    } else {
      const isDuplicate = courses.some(
        (c) => c.code.trim().toLowerCase() === trimmedCode.toLowerCase()
      );
      if (isDuplicate) {
        newErrors.code = 'Mã môn đã tồn tại';
      }
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Hãy nhập tên môn';
    }

    const scoreNum = parseFloat(score);
    if (score === '' || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      newErrors.score = 'Điểm phải từ 0 đến 10';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(
      addCourse({
        code: trimmedCode.toUpperCase(),
        name: trimmedName,
        credits: Number(credits),
        semester,
        score: scoreNum,
      })
    );

    showNotice(`Đã thêm môn ${trimmedName}`);

    setCode('');
    setName('');
    setCredits(3);
    setSemester(SEMESTERS[0]);
    setScore('');

    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3 className="card-title">Thêm môn học</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="course-code" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
              Mã môn:
            </label>
            <input
              id="course-code"
              className="input-control"
              type="text"
              ref={codeInputRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%' }}
            />
            {errors.code && (
              <div role="alert" style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                {errors.code}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="course-name" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
              Tên môn:
            </label>
            <input
              id="course-name"
              className="input-control"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%' }}
            />
            {errors.name && (
              <div role="alert" style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="course-credits" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
              Số tín chỉ:
            </label>
            <select
              id="course-credits"
              className="select-control"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              style={{ width: '100%' }}
            >
              {CREDIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="course-semester" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
              Học kỳ:
            </label>
            <select
              id="course-semester"
              className="select-control"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              style={{ width: '100%' }}
            >
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="course-score" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
              Điểm hệ 10:
            </label>
            <input
              id="course-score"
              className="input-control"
              type="number"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              style={{ width: '100%' }}
            />
            {errors.score && (
              <div role="alert" style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                {errors.score}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary">
            Thêm môn
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
