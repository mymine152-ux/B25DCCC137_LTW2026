const BUILD_TAG = "tp-4186";

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ltw_trieuphu_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        setError(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ltw_trieuphu_history', JSON.stringify(history));
    } catch (e) {
    }
  }, [history]);

  const handleAddHistory = (record) => {
    setHistory((prev) => [record, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('ltw_trieuphu_history');
    } catch (e) {
    }
  };

  return (
    <div className="app-container" data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route
            index
            element={
              <Home
                playerName={playerName}
                setPlayerName={setPlayerName}
                history={history}
              />
            }
          />
          <Route
            path="play"
            element={
              <Play
                playerName={playerName}
                questions={questions}
                onAddHistory={handleAddHistory}
              />
            }
          />
          <Route path="result" element={<Result />} />
          <Route
            path="history"
            element={
              <History
                history={history}
                onClearHistory={handleClearHistory}
              />
            }
          />
          <Route
            path="questions"
            element={<QuestionBank questions={questions} />}
          />
          <Route
            path="questions/:id"
            element={<QuestionDetail questions={questions} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
