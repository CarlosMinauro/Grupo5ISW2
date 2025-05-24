import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { API_URL, ENDPOINTS } from '../config/api';

export interface AccessLog {
    id: number;
    nombre: string;
    correo: string;
    fecha: string;
    hora: string;
    accion: string;
}

const Historial = () => {
    const [logs, setLogs] = useState<AccessLog[]>([]);

    const fetchAccessLogs = async () => {
        try {
            const response = await fetch(ENDPOINTS.ACCESS_LOGS);
            const data = await response.json();
            console.log("Data from API:",data)
            const formattedLogs: AccessLog[] = data.map((log: any) => ({
                id: log.id,
                nombre: log.usuario ? log.usuario.name : "Desconocido",
                correo: log.usuario ? log.usuario.email : "N/A",
                fecha: new Date(log.access_time).toLocaleDateString(),
                hora: new Date(log.access_time).toLocaleTimeString(),
                accion: log.action,
            }));
            setLogs(formattedLogs);
            console.log(formattedLogs)
        } catch (error) {
            console.error('Error fetching access logs:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchAccessLogs();
    }, []);

    return (
        <div className="table-section" style={{ minHeight: "80vh" }}>
            <h2 className="table-title">Historial de Accesos</h2>
            <Table className="custom-table" hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.nombre}</td>
                            <td>{log.correo}</td>
                            <td>{log.fecha}</td>
                            <td>{log.hora}</td>
                            <td>{log.accion}</td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center">No hay registros disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default Historial;
