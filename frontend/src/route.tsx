import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LinearProgress } from '@mui/material';

import MainLayout from './components/MainLayout';
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Home from './pages/home'

export const renderRoutes = () => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        <Route
          path='/'
          element={<MainLayout><Home /></MainLayout>}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
      </Routes>
    </Suspense>
  );
};

