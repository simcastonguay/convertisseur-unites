import React from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './style.css';

const theme = createTheme({
  palette: { primary: { main: '#18594b' }, background: { default: '#f5f6f2', paper: '#ffffff' }, text: { primary: '#1c302b', secondary: '#64746d' } },
  typography: { fontFamily: '"Segoe UI", system-ui, sans-serif', button: { textTransform: 'none', fontWeight: 650 } },
  shape: { borderRadius: 12 },
  components: { MuiButton: { defaultProps: { disableElevation: true } }, MuiTextField: { defaultProps: { fullWidth: true } } },
});
createRoot(document.getElementById('root')).render(<React.StrictMode><ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider></React.StrictMode>);
