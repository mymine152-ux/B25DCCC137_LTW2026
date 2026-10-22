import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [levelFilter, setLevelFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryShift = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchLevel =
      levelFilter === 'All' ? true : String(q.level) === levelFilter;
    const matchSearch = q.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="page-question-bank">
      <h1 className="page-title">Ngân hàng câu hỏi</h1>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="levelSelect">Mức độ:</label>
          <select
            id="levelSelect"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">Tất cả</option>
            <option value="1">Dễ</option>
            <option value="2">Trung bình</option>
            <option value="3">Khó</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="searchInput">Tìm kiếm:</label>
          <input
            id="searchInput"
            type="text"
            value={searchQuery}
            onChange={handleQueryShift}
            placeholder="Tìm theo nội dung câu hỏi..."
            className="text-input"
          />
        </div>
      </div>

      <div className="question-count">
        Có {filteredQuestions.length} câu hỏi.
      </div>

      <div className="table-responsive">
        <table className="questions-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mức độ</th>
              <th>Câu hỏi</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q, idx) => (
              <tr key={q.id}>
                <td>{idx + 1}</td>
                <td>{LEVELS[q.level]}</td>
                <td>
                  <Link to={`/questions/${q.id}`} className="question-link">
                    {q.question}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionBank;
