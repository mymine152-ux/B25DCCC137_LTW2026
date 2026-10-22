import React from 'react';
import { formatMoney } from '../data';

const History = ({ history, onClearHistory }) => {
  const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

  const totalPrize = history.reduce((sum, item) => sum + item.prize, 0);
  const maxPrize = history.reduce(
    (max, item) => (item.prize > max ? item.prize : max),
    0
  );

  return (
    <div className="page-history">
      <div className="history-header">
        <h1 className="history-title">Lịch sử các lượt chơi</h1>
        {history.length > 0 && (
          <button
            type="button"
            className="btn-clear-history"
            onClick={onClearHistory}
          >
            Xóa lịch sử
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="status-message empty-history">
          Chưa có lượt chơi nào.
        </div>
      ) : (
        <>
          <div className="history-summary">
            <p className="summary-item">Số lượt chơi: {history.length}</p>
            <p className="summary-item">
              Tiền thưởng cao nhất: {formatMoney(maxPrize)}
            </p>
            <p className="summary-item">
              Tổng tiền thưởng: {formatMoney(totalPrize)}
            </p>
          </div>

          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Người chơi</th>
                  <th>Số câu đúng</th>
                  <th>Tiền thưởng</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.correctCount}</td>
                    <td className="prize-cell">{formatMoney(item.prize)}</td>
                    <td>{item.playedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
