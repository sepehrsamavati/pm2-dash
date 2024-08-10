import Index from './pages/Index';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { muiThemeOptions, type ThemeName } from './core/config/muiConfig';

function App() {
  const [theme, setTheme] = useState<ThemeName>('dark');

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
