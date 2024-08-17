import List from './pages/List';
import Connect from './pages/Connect';
import { ThemeProvider } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Session, { SessionContext } from './core/Session';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { muiThemeOptions, type ThemeName } from './core/config/muiConfig';

function App() {
  const [theme] = useState<ThemeName>('dark');
  const [, setDummyState] = useState(0);
  const refreshUI = useCallback(() => setDummyState(current => current + 1), []);
  const session = useMemo(() => new Session(refreshUI), [refreshUI]);
  const electronWindowOpened = useRef(false);

  useEffect(() => {
    if (electronWindowOpened.current) return;
    electronWindowOpened.current = true;
    window.electronAPI.clientReady();
  }, []);

  return (
    <ThemeProvider theme={muiThemeOptions(theme)}>
      <SessionContext.Provider value={session}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<Connect />} />
              {session.pm2Connection ? <Route path="/List" element={<List />} /> : null}
              <Route path="*" element={<Connect />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionContext.Provider>
    </ThemeProvider>
  );
}

export default App;
