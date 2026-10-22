import React from 'react';

const AnswerButton = ({
  letter,
  text,
  index,
  selectedIndex,
  correctIndex,
  status,
  isHidden,
  onClick,
}) => {
  if (isHidden) {
    return (
      <button className="answer-btn hidden-btn" disabled type="button">
        <span className="answer-placeholder">&nbsp;</span>
      </button>
    );
  }

  let stateClass = '';
  if (status === 'locked' && selectedIndex === index) {
    stateClass = 'btn-locked';
  } else if (status === 'revealed') {
    if (index === correctIndex) {
      stateClass = 'btn-correct';
    } else if (selectedIndex === index) {
      stateClass = 'btn-wrong';
    }
  }

  const isDisabled = status !== 'answering';

  return (
    <button
      className={`answer-btn ${stateClass}`}
      disabled={isDisabled}
      onClick={() => onClick(index)}
      type="button"
    >
      <span className="answer-letter">{letter}.</span>
      <span className="answer-text">{text}</span>
    </button>
  );
};

export default AnswerButton;
