import { useEffect, useState } from "react";
import { obtenerPresupuestos } from "../services/PresupuestoService";
import { PresupuestoTipo } from "../types/PresupuestoTipo";
import { obtenerCategorias, CategoriaTipo } from "../services/CategoryService";
import { FaEdit, FaTrash } from "react-icons/fa"

import AgregarPresupuestoModal from "./AgregarPresupuestoModal";
import EliminarPresupuestoModal from "./EliminarPresupuestoModal";
import EditarPresupuestoModal from "./EditarPresupuestoModal";
import { Table } from "react-bootstrap";

function Presupuestos() {
    const [lista, setLista] = useState<PresupuestoTipo[]>([]);
    const [categorias, setCategorias] = useState<CategoriaTipo[]>([]);
    const [selectedPresupuesto, setSelectedPresupuesto] = useState<PresupuestoTipo| null>(null); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        cargarPresupuestos();
        cargarCategorias();
    }, []);

    async function cargarPresupuestos() {
        const presupuestosBD = await obtenerPresupuestos();
        setLista(presupuestosBD);
    }

    async function cargarCategorias() {
        const cats = await obtenerCategorias();
        setCategorias(cats);
    }

    // Mapea category_id => nombre
    function getCategoryName(catId: number): string {
        const cat = categorias.find((c) => c.id === catId);
        return cat ? cat.name : String(catId);
    }

    /* comentado para probar npm run build
    // Mapea nombre => category_id (para filtrar)
    function getCategoryIdByName(name: string): number | null {
        const cat = categorias.find((c) => c.name === name);
        return cat ? cat.id : null;
    }*/

    function handleDelete(p: PresupuestoTipo) {
        setSelectedPresupuesto(p);
        setIsDeleteModalOpen(true);
    }

    function handleEdit(p: PresupuestoTipo) {
        setSelectedPresupuesto(p);
        setIsEditModalOpen(true);
    }

    function handleAddClick() {
        setIsAddModalOpen(true);
    }

    const addPresupuestoHandler = async (ng_monthly_budget: number, ng_categoria: number) => {
        const presupuestoData = {
            monthly_budget: ng_monthly_budget,
            category_id: ng_categoria,
        };

        const user = sessionStorage.getItem('user');
        let token = '';
        if (user) {
            const userInfo = JSON.parse(user);
            token = userInfo.token;
        }

        const resp = await fetch(import.meta.env.VITE_API_URL + "/add-presupuesto", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(presupuestoData)
        }); 

        const data = await resp.json();

        if (data.msg == "") {
            console.log(data.presupuesto);
            await cargarPresupuestos();
        } else {
            console.log("Error al cargar presupuesto");
        }
    }

    return (
        <div className="table-section" style={{ minHeight: "80vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                <h2 className="table-title m-0">Mis Presupuestos</h2>
                <div className="d-flex flex-row">
                    <button onClick={handleAddClick} className="btn btn-primary btn-lg me-4 d-flex align-items-center">
                        Agregar
                    </button>
                </div>
            </div>
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
                                    <button onClick={() => handleEdit(p)} className="btn">
                                        <FaEdit size={25} />
                                    </button>
                                    <button onClick={() => handleDelete(p)} className="btn">
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

            {isEditModalOpen && selectedPresupuesto && (
                <EditarPresupuestoModal
                    showModal = {isEditModalOpen}
                    closeModal={() => setIsEditModalOpen(false)}
                    onUpdate={() => {
                        cargarPresupuestos();
                        setIsEditModalOpen(false);
                    }}
                    presupuesto = {selectedPresupuesto}
                    categorias = {categorias}
                />
            )}

            {isDeleteModalOpen && selectedPresupuesto && (
                <EliminarPresupuestoModal
                    closeModal={() => setIsDeleteModalOpen(false)}
                    onDelete={() => {
                        cargarPresupuestos();
                        setIsDeleteModalOpen(false);
                    }}
                    presupuestoId = {selectedPresupuesto.id}
                />
            )}

            {isAddModalOpen && (
                <AgregarPresupuestoModal
                    showModal={isAddModalOpen}
                    closeModal={() => setIsAddModalOpen(false)}
                    onAddPresupuesto={async (monthly_budget, categoria) => {
                        addPresupuestoHandler(monthly_budget, categoria);
                    }}
                    categorias = {categorias}  
                />
            )}
        </div>
    );
}

export default Presupuestos;