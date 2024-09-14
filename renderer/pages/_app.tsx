import '@/styles/globals.css';
import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import socket from './socket-client';

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#222' : '#f5f5f5',
        paper: darkMode ? '#333' : '#ffffff',
        custom: darkMode ? '#333' : '#f5faff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#cccccc' : '#666666',
      },
    },
    typography: {
      fontFamily: '',
    },
  } as any);

  useEffect(() => {
    const audio = new Audio('/dashboard/new_order-beeper.wav');
    socket.on('newOrder', (data) => {
      audio.play();
    });
    const preferences = window.localStorage.getItem('preferences');
    if (preferences) {
      const { darkMode } = JSON.parse(preferences);
      setDarkMode(darkMode);
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
          .catch((error) => console.error('Service Worker registration failed:', error));
      });
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    window.localStorage.setItem('preferences', JSON.stringify({ darkMode: newDarkMode }));
    setDarkMode(newDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider maxSnack={5}>
          <Component {...pageProps} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
