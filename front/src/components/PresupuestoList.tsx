import React from 'react';
import { Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PresupuestoTipo } from '../types/PresupuestoTypes';

interface PresupuestoListProps {
    lista: PresupuestoTipo[];
    getCategoryName: (id: number) => string;
    onEdit: (presupuesto: PresupuestoTipo) => void;
    onDelete: (presupuesto: PresupuestoTipo) => void;
}

const PresupuestoList: React.FC<PresupuestoListProps> = ({
    lista,
    getCategoryName,
    onEdit,
    onDelete
}) => {
    return (
        <div className="usertable-title">
            <Table className="custom-table" hover>
                <thead>
                    <tr>
                        <th className="text-start">Categoria</th>
                        <th className="text-start">Monto</th>
                        <th className="text-center">Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {lista.map((p) => (
                        <tr key={p.id}>
                            <td>{getCategoryName(p.category_id)}</td>
                            <td className="text-start">{p.monthly_budget}</td>
                            <td className="text-center">
                                <button onClick={() => onEdit(p)} className="btn">
                                    <FaEdit size={25} />
                                </button>
                                <button onClick={() => onDelete(p)} className="btn">
                                    <FaTrash size={25} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {lista.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center">No hay presupuestos</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default PresupuestoList; 