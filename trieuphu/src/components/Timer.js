import React from 'react';

const Timer = ({ timeLeft }) => {
  const isWarning = timeLeft <= 10;

  return (
    <div className={`timer-box ${isWarning ? 'timer-warning' : ''}`}>
      <span className="timer-text">Còn {timeLeft} giây</span>
    </div>
  );
};

export default Timer;
