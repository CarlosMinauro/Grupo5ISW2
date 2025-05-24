import React, { useState } from 'react';
import { registerUser, sendRegisterEmail } from '../services/RegisterService';

export interface RegisterFormProps {
    onRegisterSuccess: () => void;
}

export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role_id: number;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const handleRegister = async () => {
        const userData: RegisterUserData = {
            name: user,
            email: email,
            password: password,
            role_id: 2 // Usuario normal
        };
        try {
            const data = await registerUser(userData);
            if (data.msg === "") {
                const emailResp = await sendRegisterEmail(email);
                if (emailResp && emailResp.message) {
                    setInfo(emailResp.message);
                }
                onRegisterSuccess();
            } else {
                setError(data.msg);
            }
        } catch (err) {
            setError('Error en registro');
        }
    };

    return (
        <form className="flex flex-col items-center border-none rounded-xl bg-white p-10 pb-5" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
            <h1 className="text-3xl font-bold text-gray-700 mb-5">Registro</h1>
            <input className="border border-gray-400 rounded px-4 py-2 w-84 my-2" type="text"
                placeholder="Nombre de usuario" value={user} onChange={e => setUser(e.target.value)} />
            <input className="border border-gray-400 rounded px-4 py-2 w-84 my-2" type="text"
                placeholder="Correo de usuario" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="border border-gray-400 rounded px-4 py-2 w-84 my-2" type="password"
                placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {info && <div className="text-blue-500 mt-2">{info}</div>}
            <button className="bg-blue-500 text-white px-4 py-2 rounded w-84 mt-4 hover:bg-blue-600 active:bg-blue-700 cursor-pointer transition duration-200"
                type="submit">Registrar</button>
        </form>
    );
};

export default RegisterForm; 