import React from 'react';
import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ currentQuestionIndex }) => {
  const ladderItems = PRIZES.map((prize, idx) => ({
    questionNum: idx + 1,
    prize,
  })).reverse();

  return (
    <div className="money-ladder">
      <h3 className="ladder-title">Thang tiền thưởng</h3>
      <ul className="ladder-list">
        {ladderItems.map((item) => {
          const isCurrent = item.questionNum === currentQuestionIndex + 1;
          const isMilestone = MILESTONES.includes(item.questionNum);

          return (
            <li
              key={item.questionNum}
              className={`ladder-item ${isCurrent ? 'ladder-current' : ''} ${
                isMilestone ? 'ladder-milestone' : ''
              }`}
            >
              <span className="ladder-num">{item.questionNum}</span>
              <span className="ladder-prize">{formatMoney(item.prize)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MoneyLadder;
