import '../tailwind.css';
import { useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {

    const navigate = useNavigate();

    const redirectClick = () => {
        navigate('/');
    }

    return <div className="flex justify-center items-center h-screen bg-gray-200">
    <div className="flex flex-col border-none rounded-xl bg-white px-10 py-5 w-180">
        <h1 className="text-3xl font-bold text-gray-700 mb-10 text-left">Confirmacion de correo electronico</h1>
        <p className="text-gray-500 text-xl pb-5">
            Un correo electronico de confirmacio ha sido enviado a la direccion de correo registrada en la aplicacion. 
            Agradeceremos que confirme su direccion de correo antes de autenticarse.
        </p>
        <p className="text-gray-500 text-xl pb-5">
            Gracias.
        </p>
        <button className="self-center bg-blue-500 text-white px-4 py-2 rounded w-84 mt-2 hover:bg-blue-600 active:bg-blue-700 cursor-pointer transition duration-200" 
            type="button" onClick={redirectClick}>
                Confirmar
        </button>
    </div>
</div>
}

export default ConfirmationPage;