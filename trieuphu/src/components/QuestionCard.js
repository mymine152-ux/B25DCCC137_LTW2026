import React from 'react';
import AnswerButton from './AnswerButton';

const QuestionCard = ({
  questionIndex,
  question,
  selectedIndex,
  status,
  hiddenOptions,
  onSelectAnswer,
  letters,
}) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Câu {questionIndex + 1}/15</span>
      </div>
      <div className="question-content">
        <h2 className="question-title">{question.question}</h2>
      </div>
      <div className="answers-grid">
        {question.options.map((opt, idx) => (
          <AnswerButton
            key={letters[idx]}
            letter={letters[idx]}
            text={opt}
            index={idx}
            selectedIndex={selectedIndex}
            correctIndex={question.answer}
            status={status}
            isHidden={hiddenOptions.includes(idx)}
            onClick={onSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
