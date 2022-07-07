import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import './App.css';
import { renderRoutes } from './route';
import { store } from './redux/store';

function App() {
  const theme = createTheme({});
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/*
      @ts-ignore */}
      <SnackbarProvider maxSnack={3}>
        <Provider store={store}>
          <BrowserRouter>{renderRoutes()}</BrowserRouter>
        </Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
