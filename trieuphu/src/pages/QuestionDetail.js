import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionId = Number(id);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return (
      <div className="page-question-detail">
        <div className="status-message not-found-msg">
          Không tìm thấy câu hỏi
        </div>
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="page-question-detail">
      <div className="detail-card">
        <h1 className="detail-title">
          Câu hỏi số {question.id} ({LEVELS[question.level]})
        </h1>
        <p className="detail-question-text">{question.question}</p>

        <div className="detail-options-list">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.answer;
            return (
              <div
                key={LETTERS[idx]}
                className={`detail-option-item ${isCorrect ? 'correct-highlight' : ''}`}
              >
                <span className="option-letter">{LETTERS[idx]}.</span>
                <span className="option-text">{option}</span>
                {isCorrect && (
                  <span className="correct-tag"> (Đáp án đúng)</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
