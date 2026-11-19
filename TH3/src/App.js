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

  // Nạp dữ liệu mẫu ban đầu nếu chưa có saved
  useEffect(() => {
    if (!hasSaved && initialData && courses.length === 0) {
      dispatch(setCourses(initialData));
    }
  }, [initialData, dispatch, courses.length]);

  // Phím tắt / và Esc cho ô tìm kiếm
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

  // Xử lý ô tìm kiếm với tên hàm bắt buộc
  const handleCourseShift = (e) => {
    setSearchTerm(e.target.value);
  };

  // Callback ổn định cho CourseRow
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

  // Đặt lại dữ liệu mẫu
  const handleResetSampleData = () => {
    if (initialData) {
      dispatch(setCourses(initialData));
      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  // Môn học lọc theo học kỳ (dùng cho thống kê và phân bố)
  const semesterFilteredCourses = useMemo(() => {
    if (selectedSemester === 'all') {
      return courses;
    }
    return courses.filter((c) => c.semester === selectedSemester);
  }, [courses, selectedSemester]);

  // Thống kê 4 dòng đầu theo học kỳ đang chọn, dòng cuối tích lũy toàn bộ
  const semesterStats = useMemo(() => calcStats(semesterFilteredCourses), [semesterFilteredCourses]);
  const cumulativeStats = useMemo(() => calcStats(courses), [courses]);

  // Tiêu đề tab trình duyệt
  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${cumulativeStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, cumulativeStats.gpa]);

  // Bảng môn học lọc thêm theo debounce search
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

  // Phân bố điểm chữ theo thứ tự GRADES
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>Sổ điểm sinh viên</h1>
          <button
            onClick={toggleTheme}
            style={{
              padding: '6px 14px',
              backgroundColor: theme === 'light' ? '#333' : '#eee',
              color: theme === 'light' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </button>
        </div>
      </header>

      {/* Hiển thị trạng thái tải khi chưa có dữ liệu lưu */}
      {!hasSaved && loading && <p>Đang tải bảng điểm...</p>}
      {!hasSaved && error && <p>Không tải được bảng điểm</p>}

      {/* Khu vực Thống kê */}
      <section className="stat-box" style={{ margin: '20px 0', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Thống kê</h2>
        <div style={{ lineHeight: '1.8' }}>
          <div>Số môn: {semesterStats.count}</div>
          <div>Tổng tín chỉ: {semesterStats.credits}</div>
          <div>GPA (hệ 4): {semesterStats.gpa.toFixed(2)}</div>
          <div>Xếp loại: {semesterStats.rank}</div>
          <div>GPA tích lũy: {cumulativeStats.gpa.toFixed(2)}</div>
        </div>

        {/* Phân bố điểm chữ */}
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Phân bố điểm chữ</h3>
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
                <span style={{ width: '50px' }}>{`${letter}: ${count}`}</span>
                <span
                  style={{
                    display: 'inline-block',
                    height: '10px',
                    width: `${24 * count}px`,
                    backgroundColor: '#1976d2',
                    borderRadius: '2px',
                    marginLeft: '8px',
                    verticalAlign: 'middle',
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lọc học kỳ & Tìm môn học */}
      <section style={{ margin: '20px 0', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label htmlFor="select-semester" style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Xem học kỳ:
          </label>
          <select
            id="select-semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            style={{ padding: '6px 12px' }}
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
          <label htmlFor="search-input" style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Tìm môn học:
          </label>
          <input
            id="search-input"
            ref={searchInputRef}
            type="text"
            placeholder="Tìm theo tên hoặc mã môn (Phím tắt: /)"
            value={searchTerm}
            onChange={handleCourseShift}
            style={{ padding: '6px 12px', minWidth: '260px' }}
          />
        </div>

        <div>
          <span>Tìm thấy {displayedCourses.length} môn</span>
        </div>
      </section>

      {/* Bảng điểm */}
      <section style={{ margin: '20px 0' }}>
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
          <button
            onClick={handleResetSampleData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#546e7a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Đặt lại dữ liệu mẫu
          </button>
        </div>
      </section>

      {/* Form thêm môn học */}
      <AddCourseForm />

      {/* Mục tiêu GPA */}
      <GoalPlanner />
    </div>
  );
};

export default App;
