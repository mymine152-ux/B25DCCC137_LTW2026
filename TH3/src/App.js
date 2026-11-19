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

  const [activeTab, setActiveTab] = useState('table');
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
          setActiveTab('table');
          setTimeout(() => {
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }, 50);
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
      <div className="container">
        <div className="header">
          <h1>Sổ điểm sinh viên</h1>
          <button onClick={toggleTheme} className="btn">
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </button>
        </div>

        <div className="nav-tabs">
          <button
            onClick={() => setActiveTab('table')}
            className={activeTab === 'table' ? 'active' : ''}
          >
            Bảng điểm
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={activeTab === 'stats' ? 'active' : ''}
          >
            Thống kê & Mục tiêu
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={activeTab === 'add' ? 'active' : ''}
          >
            Thêm môn học
          </button>
        </div>

        {!hasSaved && loading && <p>Đang tải bảng điểm...</p>}
        {!hasSaved && error && <p>Không tải được bảng điểm</p>}

        {activeTab === 'table' && (
          <div className="section-box">
            <div className="filter-bar">
              <div>
                <label htmlFor="select-semester" style={{ marginRight: '6px' }}>
                  Xem học kỳ:
                </label>
                <select
                  id="select-semester"
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

              <div>
                <label htmlFor="search-input" style={{ marginRight: '6px' }}>
                  Tìm môn học:
                </label>
                <input
                  id="search-input"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Nhập tên hoặc mã môn..."
                  value={searchTerm}
                  onChange={handleCourseShift}
                  style={{ width: '220px' }}
                />
              </div>

              <div>
                <span>Tìm thấy {displayedCourses.length} môn</span>
              </div>
            </div>

            {courses.length === 0 ? (
              <p>Chưa có môn học nào</p>
            ) : displayedCourses.length === 0 ? (
              <p>Chưa có môn học nào phù hợp với tìm kiếm</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Mã môn</th>
                    <th>Tên môn</th>
                    <th>Tín chỉ</th>
                    <th>Học kỳ</th>
                    <th>Điểm (hệ 10)</th>
                    <th>Điểm chữ</th>
                    <th>Điểm (hệ 4)</th>
                    <th style={{ textAlign: 'center' }}>Số lần render</th>
                    <th>Xóa</th>
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

            <div style={{ marginTop: '16px' }}>
              <button onClick={handleResetSampleData} className="btn">
                Đặt lại dữ liệu mẫu
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <div className="section-box">
              <h3>Thống kê</h3>
              <div style={{ lineHeight: '1.8' }}>
                <div>Số môn: {semesterStats.count}</div>
                <div>Tổng tín chỉ: {semesterStats.credits}</div>
                <div>GPA (hệ 4): {semesterStats.gpa.toFixed(2)}</div>
                <div>Xếp loại: {semesterStats.rank}</div>
                <div>GPA tích lũy: {cumulativeStats.gpa.toFixed(2)}</div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Phân bố điểm chữ</h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                  {gradeDistribution.map(({ letter, count }) => (
                    <li
                      key={letter}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ width: '45px' }}>{`${letter}: ${count}`}</span>
                      <span
                        style={{
                          display: 'inline-block',
                          height: '10px',
                          width: `${24 * count}px`,
                          backgroundColor: '#1976d2',
                          borderRadius: '2px',
                          marginLeft: '8px',
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <GoalPlanner />
          </div>
        )}

        {activeTab === 'add' && <AddCourseForm />}
      </div>
    </div>
  );
};

export default App;
