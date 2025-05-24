//import React from 'react';
import '../tailwind.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { API_URL, ENDPOINTS } from '../config/api';

const RecuperarContraseña = () => {

  const navigate = useNavigate();

  const [ email, setEmail ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")
  const [ rw_password, setRw_password ] = useState<string>("")

  const handleEmailChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }

  const handlePasswordChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }

  const handleRw_passwordChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setRw_password(e.currentTarget.value)
  }

  const resetPasswordHandler = async () => {
    const userData = { email, password, rw_password };

    try {
        const response = await fetch(ENDPOINTS.RESET_PASSWORD, {
            method: 'POST',
        headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (data.msg === "") {
            console.log("Cambio de contraseña exitoso");
            navigate("/");
        } else {
            console.log("Error en el cambio de contraseña");
            navigate("/recuperar-contraseña");
        }
    } catch (error) {
        console.error("Error en el cambio de contraseña:", error);
        navigate("/recuperar-contraseña");
          }
  };





  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col items-center border-none rounded-xl bg-white p-10 pb-5">
        <h1 className="text-3xl font-bold text-gray-700 mb-10">Nueva contraseña</h1>
        <input className="border border-gray-400 rounded px-4 py-2 w-64 my-2" 
              type="text" 
              placeholder="Ingresar correo"
              value={email}
              onChange={handleEmailChange}/>


        <input className="border border-gray-400 rounded px-4 py-2 w-64 my-2" 
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={handlePasswordChange}/>


        <input className="border border-gray-400 rounded px-4 py-2 w-64 my-2" 
                type="password" 
                placeholder="Re-escribir nueva contraseña"
                value={rw_password}
                onChange={handleRw_passwordChange}/>


        <button className="bg-blue-500 text-white px-4 py-2 rounded w-64 mt-7 hover:bg-blue-600 active:bg-blue-700 cursor-pointer transition duration-200"
        type="button"
        onClick={resetPasswordHandler}>Aceptar</button>
      </div>
    </div>
  );
};

export default RecuperarContraseña;
