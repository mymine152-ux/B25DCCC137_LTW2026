import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { GRADES, SEMESTERS } from './data';
import { calcStats } from './utils';
import { hasSaved } from './store';
import { removeCourse, selectCourses, setCourses, setScore } from './features/coursesSlice';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import CourseRow from './components/CourseRow';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = 'gp-4073';

const App = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [selectedSemester, setSelectedSemester] = useLocalStorage('ltw_sodiem_semester', 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const searchInputRef = useRef(null);

  const { data: initialData, loading, error } = useFetch('/data/courses.json');

  useEffect(() => {
    if (!hasSaved && initialData && courses.length === 0) {
      dispatch(setCourses(initialData));
    }
  }, [initialData, dispatch, courses.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/') {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isEditable = document.activeElement ? document.activeElement.isContentEditable : false;
        if (activeTag !== 'input' && activeTag !== 'select' && activeTag !== 'textarea' && !isEditable) {
          e.preventDefault();
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }
      } else if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          setSearchTerm('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCourseShift = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScoreChange = useCallback(
    (id, score) => {
      dispatch(setScore({ id, score }));
    },
    [dispatch]
  );

  const handleRemoveCourse = useCallback(
    (id, name) => {
      dispatch(removeCourse(id));
      showNotice(`Đã xóa môn ${name}`);
    },
    [dispatch, showNotice]
  );

  const handleResetSampleData = () => {
    if (initialData) {
      dispatch(setCourses(initialData));
      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  const semesterFilteredCourses = useMemo(() => {
    if (selectedSemester === 'all') {
      return courses;
    }
    return courses.filter((c) => c.semester === selectedSemester);
  }, [courses, selectedSemester]);

  const semesterStats = useMemo(() => calcStats(semesterFilteredCourses), [semesterFilteredCourses]);
  const cumulativeStats = useMemo(() => calcStats(courses), [courses]);

  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${cumulativeStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, cumulativeStats.gpa]);

  const displayedCourses = useMemo(() => {
    const trimmed = debouncedSearch.trim().toLowerCase();
    return semesterFilteredCourses.filter((c) => {
      if (!trimmed) return true;
      return (
        c.name.toLowerCase().includes(trimmed) ||
        c.code.toLowerCase().includes(trimmed)
      );
    });
  }, [semesterFilteredCourses, debouncedSearch]);

  const gradeDistribution = useMemo(() => {
    return GRADES.map((g) => {
      const count = semesterFilteredCourses.filter((c) => {
        const found = GRADES.find((item) => c.score >= item.min) || GRADES[GRADES.length - 1];
        return found.letter === g.letter;
      }).length;
      return { letter: g.letter, count };
    });
  }, [semesterFilteredCourses]);

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Sổ điểm sinh viên</h1>
            <p style={{ margin: '6px 0 0 0', opacity: 0.75, fontSize: '14px' }}>
              Quản lý học phần, tính toán GPA và dự phóng mục tiêu học tập
            </p>
          </div>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? ' Chế độ tối' : ' Chế độ sáng'}
          </button>
        </header>

        {!hasSaved && loading && <p>Đang tải bảng điểm...</p>}
        {!hasSaved && error && <p>Không tải được bảng điểm</p>}

        <div className="dashboard-grid">
          <section className="card">
            <h2 className="card-title">Thống kê</h2>
            <div className="stats-list">
              <div className="stats-item">
                <span>Số môn học:</span>
                <strong>{semesterStats.count}</strong>
              </div>
              <div className="stats-item">
                <span>Tổng số tín chỉ:</span>
                <strong>{semesterStats.credits}</strong>
              </div>
              <div className="stats-item">
                <span>GPA (hệ 4):</span>
                <strong>{semesterStats.gpa.toFixed(2)}</strong>
              </div>
              <div className="stats-item">
                <span>Xếp loại học tập:</span>
                <strong>{semesterStats.rank}</strong>
              </div>
              <div className="stats-item" style={{ borderBottom: 'none' }}>
                <span>GPA tích lũy:</span>
                <strong style={{ color: '#2563eb' }}>{cumulativeStats.gpa.toFixed(2)}</strong>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700 }}>Phân bố điểm chữ</h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                {gradeDistribution.map(({ letter, count }) => (
                  <li
                    key={letter}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '6px',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ width: '45px', fontWeight: 600 }}>{`${letter}: ${count}`}</span>
                    <span
                      style={{
                        display: 'inline-block',
                        height: '10px',
                        width: `${24 * count}px`,
                        backgroundColor: '#2563eb',
                        borderRadius: '3px',
                        marginLeft: '8px',
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <GoalPlanner />
        </div>

        <section className="card">
          <div className="toolbar">
            <div>
              <label htmlFor="select-semester" style={{ marginRight: '8px', fontWeight: 600, fontSize: '14px' }}>
                Xem học kỳ:
              </label>
              <select
                id="select-semester"
                className="select-control"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <input
                id="search-input"
                className="input-control"
                ref={searchInputRef}
                type="text"
                placeholder="Tìm môn học theo mã hoặc tên (Phím tắt: /)"
                value={searchTerm}
                onChange={handleCourseShift}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, opacity: 0.85 }}>
                Tìm thấy {displayedCourses.length} môn
              </span>
            </div>
          </div>

          <div className="table-responsive">
            {courses.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '24px 0', opacity: 0.6 }}>Chưa có môn học nào</p>
            ) : displayedCourses.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '24px 0', opacity: 0.6 }}>Không tìm thấy môn học phù hợp</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Mã môn</th>
                    <th>Tên môn</th>
                    <th style={{ textAlign: 'center' }}>Tín chỉ</th>
                    <th>Học kỳ</th>
                    <th>Điểm (hệ 10)</th>
                    <th>Điểm chữ</th>
                    <th>Điểm (hệ 4)</th>
                    <th style={{ textAlign: 'center' }}>Số lần render</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCourses.map((c) => (
                    <CourseRow
                      key={c.id}
                      course={c}
                      onScore={handleScoreChange}
                      onRemove={handleRemoveCourse}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handleResetSampleData} className="btn btn-secondary">
              Đặt lại dữ liệu mẫu
            </button>
          </div>
        </section>

        <AddCourseForm />
      </div>
    </div>
  );
};

export default App;
