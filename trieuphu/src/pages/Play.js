import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, calcAudienceVotes } from '../utils';

const Play = ({ playerName, questions, onAddHistory }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [audienceVotes, setAudienceVotes] = useState(null);
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    audience: false,
  });

  const currentQuestion = questions[currentIndex];

  const finishGame = useCallback(
    (correctCount, reason) => {
      const prize = calcPrize(correctCount, reason);
      const record = {
        id: Date.now(),
        name: playerName,
        prize,
        correctCount,
        playedAt: new Date().toLocaleString('vi-VN'),
      };
      onAddHistory(record);
      navigate('/result', {
        replace: true,
        state: {
          playerName,
          prize,
          correctCount,
          reason,
        },
      });
    },
    [playerName, onAddHistory, navigate]
  );

  useEffect(() => {
    document.title = `Câu ${currentIndex + 1}/15 – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [currentIndex, playerName]);

  useEffect(() => {
    if (status !== 'answering') return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          finishGame(currentIndex, 'timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status, currentIndex, finishGame]);

  useEffect(() => {
    if (status === 'locked') {
      const lockTimer = setTimeout(() => {
        setStatus('revealed');
      }, 1000);

      return () => {
        clearTimeout(lockTimer);
      };
    }

    if (status === 'revealed') {
      const isCorrect = selectedIndex === currentQuestion.answer;
      const revealTimer = setTimeout(() => {
        if (isCorrect) {
          if (currentIndex === 14) {
            finishGame(15, 'win');
          } else {
            setCurrentIndex((prev) => prev + 1);
            setStatus('answering');
            setSelectedIndex(null);
            setTimeLeft(TIME_PER_QUESTION);
            setHiddenOptions([]);
            setAudienceVotes(null);
          }
        } else {
          finishGame(currentIndex, 'wrong');
        }
      }, 2000);

      return () => {
        clearTimeout(revealTimer);
      };
    }
  }, [status, selectedIndex, currentQuestion, currentIndex, finishGame]);

  const handleSelectAnswer = useCallback(
    (index) => {
      if (status !== 'answering') return;
      if (hiddenOptions.includes(index)) return;

      setSelectedIndex(index);
      setStatus('locked');
    },
    [status, hiddenOptions]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'answering') return;

      const key = e.key.toUpperCase();
      const letterIndex = LETTERS.indexOf(key);

      if (letterIndex !== -1 && !hiddenOptions.includes(letterIndex)) {
        handleSelectAnswer(letterIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, hiddenOptions, handleSelectAnswer]);

  const handleFiftyFifty = () => {
    if (status !== 'answering' || usedLifelines.fiftyFifty) return;

    const wrongIndices = [0, 1, 2, 3].filter(
      (idx) => idx !== currentQuestion.answer
    );
    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    setHiddenOptions([shuffled[0], shuffled[1]]);
    setUsedLifelines((prev) => ({ ...prev, fiftyFifty: true }));
  };

  const handleAudience = () => {
    if (status !== 'answering' || usedLifelines.audience) return;

    const votes = calcAudienceVotes(currentQuestion.answer, hiddenOptions);
    setAudienceVotes(votes);
    setUsedLifelines((prev) => ({ ...prev, audience: true }));
  };

  const handleStopGame = () => {
    if (status !== 'answering') return;
    finishGame(currentIndex, 'stop');
  };

  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (!currentQuestion) {
    return <div className="status-message">Không có dữ liệu câu hỏi.</div>;
  }

  return (
    <div className="page-play">
      <div className="play-main-col">
        <div className="play-top-bar">
          <Timer timeLeft={timeLeft} />
          <Lifelines
            usedLifelines={usedLifelines}
            onUseFiftyFifty={handleFiftyFifty}
            onUseAudience={handleAudience}
            onStopGame={handleStopGame}
            disabled={status !== 'answering'}
          />
        </div>

        {audienceVotes && (
          <AudienceChart votes={audienceVotes} letters={LETTERS} />
        )}

        <QuestionCard
          questionIndex={currentIndex}
          question={currentQuestion}
          selectedIndex={selectedIndex}
          status={status}
          hiddenOptions={hiddenOptions}
          onSelectAnswer={handleSelectAnswer}
          letters={LETTERS}
        />
      </div>

      <div className="play-side-col">
        <MoneyLadder currentQuestionIndex={currentIndex} />
      </div>
    </div>
  );
};

export default Play;
