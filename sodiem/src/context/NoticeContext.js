import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((text, onUndo = null) => {
    setNotice({ text, onUndo });
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => {
      setNotice(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {notice && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            backgroundColor: '#2e7d32',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>{notice.text}</span>
          {notice.onUndo && (
            <button
              onClick={() => {
                notice.onUndo();
                setNotice(null);
              }}
              style={{
                backgroundColor: '#ffffff',
                color: '#2e7d32',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              Hoàn tác
            </button>
          )}
        </div>
      )}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNotice phải dùng bên trong NoticeProvider');
  }
  return context;
};


