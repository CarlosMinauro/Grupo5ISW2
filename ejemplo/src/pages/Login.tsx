// src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../tailwind.css';
import ModalLoginError from './ModalLoginError';

export const addAccessLog = async (actionText: string) => {
  const ALInfo = { action: actionText };
  const userStr = sessionStorage.getItem('user');
  let token = '';
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  try {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/accesslogs`, {
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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const handleForgotPassword = () => {
    navigate('/recuperar-contraseña');
  };

  const handleRegister = () => {
    navigate('/registrarse');
  };

  const loginHandler = async () => {
    const userData = { email, password };
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await resp.json();
      if (data.msg === "") {
        const token = data.body;
        sessionStorage.setItem('user', JSON.stringify(token));
        setEmail('');
        setPassword('');
        if (token.role_id === 1) {
          navigate('/appadmin/dashboard');
        } else {
          navigate('/app/dashboard');
        }
        addAccessLog("Login");
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error en login:", error);
      setShowModal(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col items-center border-none rounded-xl bg-white p-10 pb-5">
        <h1 className="text-3xl font-bold text-gray-700 mb-10">Log In</h1>
        <input
          className="border border-gray-400 rounded px-4 py-2 w-84 my-2"
          type="text"
          placeholder="Ingresar correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-400 rounded px-4 py-2 w-84 my-2"
          type="password"
          placeholder="Ingresar contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a
          className="text-blue-400 underline mb-4 cursor-pointer"
          onClick={handleForgotPassword}
        >
          ¿Olvidaste tu contraseña?
        </a>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-84 mt-2 hover:bg-blue-600 active:bg-blue-700 cursor-pointer transition duration-200"
          type="button"
          onClick={loginHandler}
        >
          Ingresar
        </button>
        <p className="text-gray-500 p-1">O</p>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded w-84 hover:bg-gray-600 active:bg-gray-700 cursor-pointer transition duration-200"
          type="button"
          onClick={handleRegister}
        >
          Registrarse
        </button>
      </div>
      <ModalLoginError showModal={showModal} closeModal={() => setShowModal(false)} />
    </div>
  );
};

export default Login;
