import List from './pages/List';
import Connect from './pages/Connect';
import { ThemeProvider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { muiThemeOptions, type ThemeName } from './core/config/muiConfig';

function App() {
  const [theme] = useState<ThemeName>('dark');
  const electronWindowOpened = useRef(false);

  useEffect(() => {
    if (electronWindowOpened.current) return;
    electronWindowOpened.current = true;
    window.electronAPI.clientReady();
  }, []);

  return (
    <ThemeProvider theme={muiThemeOptions(theme)}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Connect />} />
            <Route path="/List" element={<List />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
