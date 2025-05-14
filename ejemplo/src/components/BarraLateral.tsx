import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListGroup, Image } from "react-bootstrap";
import { VscGraph } from "react-icons/vsc";
import { FaCog, FaDollarSign, FaSignOutAlt, FaMoneyBill } from "react-icons/fa";
//import "./BarraLateral.css"; // Asegúrate de tener este archivo para estilos personalizados

const URL_BACKEND = import.meta.env.VITE_API_URL ;

interface User {
    id: number;
    name: string;
    email: string;
}

const BarraLateral: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userStr = sessionStorage.getItem('user');
            if (!userStr) {
                console.error('User not found in localStorage');
                return;
            }

            const token = JSON.parse(userStr).token;

            try {
                const response = await fetch(`${URL_BACKEND}/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.msg === "") {
                    setUser(data.user);
                } else {
                    console.error('Error fetching user:', data.msg);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="sidebar d-flex flex-column p-3">
            <Image
                src="https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/45843.png&w=350&h=254"
                roundedCircle
                className="mb-3"
            />
            <h5 className="text-center">{user ? user.name : "Cargando..."}</h5>
            <ListGroup variant="flush">
                <ListGroup.Item
                    as={Link} to="/app/dashboard"
                    action
                    className="text-secondary d-flex align-items-center">
                    <VscGraph /> Dashboard
                </ListGroup.Item>
                <ListGroup.Item
                    as={Link}
                    to="/app/gastos"
                    action
                    className="text-muted d-flex align-items-center">
                    <FaMoneyBill /> Gastos
                </ListGroup.Item>
                <ListGroup.Item
                    as={Link}
                    to="/app/presupuestos"
                    action
                    className="text-secondary d-flex align-items-center">
                    <FaDollarSign /> Presupuestos
                </ListGroup.Item>
                <ListGroup.Item
                    as={Link}
                    to="/app/configuracion"
                    action
                    className="text-muted d-flex align-items-center">
                    <FaCog /> Configuración
                </ListGroup.Item>
                <ListGroup.Item
                    as={Link}
                    to="/"
                    action
                    className="text-muted salir-item d-flex align-items-center"
                    onClick={() => {
                        sessionStorage.removeItem("user");
                        console.log("Saliendo...");
                        // navigate('/');
                    }}>
                    <FaSignOutAlt /> Salir
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}

export default BarraLateral;