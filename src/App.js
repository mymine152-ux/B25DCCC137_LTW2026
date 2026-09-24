import React, { useState } from 'react';
import StudentList from './StudentList';
import './App.css';

const initialStudents = [
  { id: 1, name: 'Nguyễn Văn A', score: 8.5, className: '12A1' },
  { id: 2, name: 'Trần Thị B', score: 4.0, className: '12A2' },
  { id: 3, name: 'Lê Văn C', score: 6.5, className: '12A1' },
  { id: 4, name: 'Phạm Thị D', score: 9.0, className: '12A3' },
  { id: 5, name: 'Hoàng Văn E', score: 3.5, className: '12A2' },
];

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAdd = () => {
    const trimmedName = name.trim();
    const trimmedClass = className.trim();
    const scoreNum = parseFloat(score);

    if (!trimmedName || !trimmedClass || score === '') {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError('Điểm số phải từ 0 đến 10!');
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: trimmedName,
      score: scoreNum,
      className: trimmedClass,
    };

    setStudents([...students, newStudent]);
    setName('');
    setScore('');
    setClassName('');
    setError('');
  };

  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const getFilteredStudents = () => {
    if (filter === 'gioi') return students.filter((s) => s.score >= 8);
    if (filter === 'kha') return students.filter((s) => s.score >= 6.5 && s.score < 8);
    if (filter === 'truot') return students.filter((s) => s.score < 5);
    return students;
  };

  const filteredStudents = getFilteredStudents();

  const totalStudents = students.length;
  const doCount = students.filter((s) => s.score >= 5).length;
  const truotCount = students.filter((s) => s.score < 5).length;
  const averageScore =
    totalStudents > 0
      ? (students.reduce((sum, s) => sum + s.score, 0) / totalStudents).toFixed(2)
      : 0;

  return (
    <div className="app-container">
      <h1>Quản Lý Điểm Sinh Viên</h1>

      <div className="main-layout">
        {/* Cột trái: Form + Thống kê + Bộ lọc */}
        <div className="left-panel">
          <div className="form-section">
            <h2>Thêm sinh viên mới</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Họ tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Điểm số (0-10)"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="0"
                max="10"
                step="0.1"
              />
              <input
                type="text"
                placeholder="Lớp"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
              <button onClick={handleAdd}>Thêm</button>
            </div>
            {error && <p className="error-msg">{error}</p>}
          </div>

          <div className="stats-section">
            <h2>Thống kê</h2>
            <p>Tổng sinh viên: <strong>{totalStudents}</strong></p>
            <p>Điểm trung bình: <strong>{averageScore}</strong></p>
            <p className="stat-do">Đỗ (≥ 5): <strong>{doCount}</strong></p>
            <p className="stat-truot">Trượt (&lt; 5): <strong>{truotCount}</strong></p>
          </div>

          <div className="filter-section">
            <h2>Bộ lọc</h2>
            <div className="filter-buttons">
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                Tất cả
              </button>
              <button
                className={filter === 'gioi' ? 'active' : ''}
                onClick={() => setFilter('gioi')}
              >
                Giỏi (≥ 8)
              </button>
              <button
                className={filter === 'kha' ? 'active' : ''}
                onClick={() => setFilter('kha')}
              >
                Khá (6.5 - 8)
              </button>
              <button
                className={filter === 'truot' ? 'active' : ''}
                onClick={() => setFilter('truot')}
              >
                Trượt (&lt; 5)
              </button>
            </div>
          </div>
        </div>

        {/* Cột phải: Bảng danh sách */}
        <div className="right-panel">
          <h2>Danh sách sinh viên</h2>
          <StudentList students={filteredStudents} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default App;
