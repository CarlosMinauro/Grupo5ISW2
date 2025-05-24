import React from 'react';
import '../tailwind.css';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <RegisterForm onRegisterSuccess={() => navigate('/confirmation')} />
        </div>
    );
}

export default RegisterPage;