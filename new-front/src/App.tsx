import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RootState } from './store';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CardSelection from './pages/CardSelection';
import AddCard from './pages/AddCard';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (isAuthenticated && user) {
    // Redirect authenticated users to card selection instead of dashboard
    return <Navigate to="/card-selection" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/card-selection"
            element={
              <ProtectedRoute>
                <CardSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:creditCardId"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-card"
            element={
              <ProtectedRoute>
                <AddCard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/card-selection" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 