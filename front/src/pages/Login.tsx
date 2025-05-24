// src/pages/Login.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../tailwind.css';
import ModalLoginError from './ModalLoginError';
import LoginForm from '../components/LoginForm';

export const addAccessLog = async (actionText: string) => {
  const ALInfo = { action: actionText };
  const userStr = sessionStorage.getItem('user');
  let token = '';
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  try {
    const resp = await fetch('/api/accesslogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(ALInfo)
    });
    const data = await resp.json();
    console.log("AccessLog:", data);
  } catch (err) {
    console.error("Error en access log:", err);
  }
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = sessionStorage.getItem("user");
    if (loggedUser) {
      const tokenData = JSON.parse(loggedUser);
      if (tokenData.role_id === 1) {
        navigate('/appadmin/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <LoginForm onLoginSuccess={() => {}} />
    </div>
  );
};

export default Login;
