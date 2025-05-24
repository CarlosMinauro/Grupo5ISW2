import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalLoginError from '../pages/ModalLoginError';
import { loginUser } from '../services/LoginService';
import { addAccessLog } from '../pages/Login';

// Principio SRP: Este componente solo se encarga del formulario y la interacción de login
export interface LoginFormProps {
    onLoginSuccess: () => void;
}

// Principio ISP: Definimos solo los datos necesarios para login
export interface LoginUserData {
    email: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Principio SRP: Solo maneja el submit del formulario
    const handleLogin = async () => {
        const userData: LoginUserData = { email, password };
        try {
            const data = await loginUser(userData);
            if (data.token) {
                const userInfo = {
                    token: data.token,
                    role_id: data.role_id,
                    email: data.email
                };
                sessionStorage.setItem('user', JSON.stringify(userInfo));
                setEmail('');
                setPassword('');
                if (userInfo.role_id === 1) {
                    navigate('/appadmin/dashboard');
                } else {
                    navigate('/app/dashboard');
                }
                addAccessLog('Login');
                onLoginSuccess();
            } else {
                setShowModal(true);
            }
        } catch (error) {
            setShowModal(true);
        }
    };

    // Principio OCP: Navegación desacoplada, se puede extender por props
    const handleForgotPassword = () => {
        navigate('/recuperar-contraseña');
    };
    const handleRegister = () => {
        navigate('/registrarse');
    };

    return (
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
                onClick={handleLogin}
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
            <ModalLoginError showModal={showModal} closeModal={() => setShowModal(false)} />
        </div>
    );
};

export default LoginForm; 