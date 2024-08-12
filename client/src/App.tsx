import Index from './pages/Index';
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material';
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
            <Route path="/" element={<Index />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
