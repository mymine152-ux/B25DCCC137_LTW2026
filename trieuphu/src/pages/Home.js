import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const [nameInput, setNameInput] = useState(playerName || '');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setPlayerName(nameInput.trim());
    navigate('/play');
  };

  const bestRecord =
    history.length > 0
      ? [...history].sort((a, b) => b.prize - a.prize)[0]
      : null;

  return (
    <div className="page-home">
      <div className="home-card">
        <h1 className="home-title">Ai là triệu phú</h1>

        {bestRecord && (
          <div className="record-badge">
            Kỷ lục: {formatMoney(bestRecord.prize)} – {bestRecord.name}
          </div>
        )}

        <div className="rules-section">
          <h3>Luật chơi:</h3>
          <ul>
            <li>Người chơi lần lượt trả lời 15 câu hỏi trắc nghiệm kiến thức Lập trình Web.</li>
            <li>Mỗi câu có 30 giây để trả lời. Hết giờ được tính như trả lời sai.</li>
            <li>Các mốc 5, 10, 15 là mốc an toàn. Trả lời sai người chơi sẽ nhận mức tiền an toàn cao nhất đã vượt qua.</li>
            <li>Có 3 quyền trợ giúp: 50:50, Hỏi khán giả và Dừng cuộc chơi để mang tiền về.</li>
          </ul>
        </div>

        <form onSubmit={handleStart} className="start-form">
          <div className="form-group">
            <label htmlFor="playerNameInput">Tên người chơi:</label>
            <input
              id="playerNameInput"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nhập tên người chơi..."
              className="text-input"
            />
          </div>
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="btn-start"
          >
            Bắt đầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
