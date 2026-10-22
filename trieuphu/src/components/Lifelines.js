import React from 'react';

const Lifelines = ({
  usedLifelines,
  onUseFiftyFifty,
  onUseAudience,
  onStopGame,
  disabled,
}) => {
  return (
    <div className="lifelines-container">
      <button
        className="lifeline-btn"
        disabled={disabled || usedLifelines.fiftyFifty}
        onClick={onUseFiftyFifty}
        type="button"
      >
        50:50
      </button>
      <button
        className="lifeline-btn"
        disabled={disabled || usedLifelines.audience}
        onClick={onUseAudience}
        type="button"
      >
        Hỏi khán giả
      </button>
      <button
        className="lifeline-btn btn-stop"
        disabled={disabled}
        onClick={onStopGame}
        type="button"
      >
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;
