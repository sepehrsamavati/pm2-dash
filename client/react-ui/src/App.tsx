import List from './pages/List';
import Login from './pages/Login';
import Connect from './pages/Connect';
import { AccountType } from './types/enums';
import UserList from './pages/user/UserList';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import Session, { SessionContext } from './core/Session';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { muiThemeOptions, type ThemeName } from './core/config/muiConfig';
import { SnackbarProviderConfigurator } from './core/helpers/snackbarProvider';

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
    <>
      <SnackbarProvider maxSnack={3}>
        <SnackbarProviderConfigurator />
      </SnackbarProvider>
      <ThemeProvider theme={muiThemeOptions(theme)}>
        <SessionContext.Provider value={session}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<Connect />} />
                <Route path="/Login" element={<Login />} />
                {session.user?.type === AccountType.Admin ? (
                  <Route path="/Users">
                    <Route path="List" element={<UserList />} />
                  </Route>
                ) : null}
                {session.pm2Connection ? <Route path="/List" element={<List />} /> : null}
                <Route path="*" element={<Connect />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SessionContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
