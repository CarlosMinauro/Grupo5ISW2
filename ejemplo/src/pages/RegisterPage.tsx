import React, { useState } from 'react';
import '../tailwind.css';
import { useNavigate } from 'react-router-dom';
// import { addAccessLog } from './Login';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const userChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value);
        // console.log(event.target.value);
    }

    const emailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        // console.log(event.target.value);
    }

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        // console.log(event.target.value);
    }

    const registerHandler = async (register_user: string, register_email: string, register_pswd: string) => {
        const userData = {
            name: register_user,
            email: register_email,
            password: register_pswd
        }
        
        const resp = await fetch(import.meta.env.VITE_API_URL + "/register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await resp.json();
        if (data.msg == "") {
            navigate('/confirmation');
            console.log(data.usuario);
        } else {
            console.log(data.msg);
        }
    }


    const sendEmail = async () => {
        const mainpage = import.meta.env.VITE_API_URL + "/app/dashboard";

        const text = `
            <p>Hello,</p>
            <p>Thank you for registering! Click the link below to access to the main page:</p>
            <a href="${mainpage}" target="_blank">Go to Main Page</a>
            <p>If the link doesn't work, copy and paste this URL into your browser:</p>
            <p>${mainpage}</p>
        `;

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/register/send-email", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'Test',
                    html: text,
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    

    return <div className="flex justify-center items-center h-screen bg-gray-200">
    <form className="flex flex-col items-center border-none rounded-xl bg-white p-10 pb-5">
        <h1 className="text-3xl font-bold text-gray-700 mb-5">Registro</h1>
        <input className="border border-gray-400 rounded px-4 py-2 w-84 my-2" type="text" 
            placeholder="Nombre de usuario" value={user} onChange={userChange}/>
        <input className="border border-gray-400 rounded px-4 py-2 w-84 my-2" type="text" 
            placeholder="Correo de usuario"value={email} onChange={emailChange}/>
        <input className="border border-gray-400 rounded px-4 py-2 w-84 my-2" type="password" 
            placeholder="Contraseña" value={password} onChange={passwordChange}/>
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-84 mt-4 hover:bg-blue-600 active:bg-blue-700 cursor-pointer transition duration-200" 
            type="button" onClick={() => {
                registerHandler(user, email, password);
                // addAccessLog('Registro', true);
                // registerClick();
                sendEmail();
            }}>Registrar</button>
    </form>
</div>
}

export default RegisterPage;