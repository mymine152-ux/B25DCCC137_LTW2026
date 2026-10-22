import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { playerName, prize, correctCount, reason } = state;

  let headingText = '';
  if (reason === 'win') {
    headingText = 'Chúc mừng! Bạn đã trở thành triệu phú';
  } else if (reason === 'wrong') {
    headingText = 'Rất tiếc, bạn đã trả lời sai';
  } else if (reason === 'timeout') {
    headingText = 'Hết giờ!';
  } else if (reason === 'stop') {
    headingText = 'Bạn đã dừng cuộc chơi';
  }

  return (
    <div className="page-result">
      <div className="result-card">
        <h1 className="result-heading">{headingText}</h1>
        <div className="result-details">
          <p className="result-row">
            <span className="result-label">Người chơi:</span>
            <strong className="result-value">{playerName}</strong>
          </p>
          <p className="result-row">
            <span className="result-label">Số câu trả lời đúng:</span>
            <strong className="result-value">{correctCount}</strong>
          </p>
          <p className="result-row">
            <span className="result-label">Tiền thưởng:</span>
            <strong className="result-value prize-value">
              {formatMoney(prize)}
            </strong>
          </p>
        </div>
        <div className="result-actions">
          <button
            type="button"
            className="btn-replay"
            onClick={() => navigate('/play')}
          >
            Chơi lại
          </button>
          <button
            type="button"
            className="btn-home"
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
