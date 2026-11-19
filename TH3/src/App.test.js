import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import { NoticeProvider } from './context/NoticeContext';

test('renders Sổ điểm sinh viên title', () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <NoticeProvider>
          <App />
        </NoticeProvider>
      </ThemeProvider>
    </Provider>
  );
  const titleElement = screen.getByText(/Sổ điểm sinh viên/i);
  expect(titleElement).toBeInTheDocument();
});
