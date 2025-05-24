import React, { useEffect, useState } from "react";
import { PresupuestoTipo } from "../types/PresupuestoTipo";
import { actualizarPresupuesto } from "../services/PresupuestoService";
import { CategoriaTipo } from "../services/CategoryService";


interface EditarPresupuestoModalProps {
    showModal: boolean;
    closeModal: () => void;
    onUpdate: () => void;
    presupuesto: PresupuestoTipo;
    categorias: CategoriaTipo[];
}

const EditarPresupuestoModal: React.FC<EditarPresupuestoModalProps> = ({ showModal, closeModal, onUpdate, presupuesto, categorias }) => {
    const [categoriaId, setCategoriaId] = useState(presupuesto.category_id);
    const [monto, setMonto] = useState<number | "">(presupuesto.monthly_budget);

    useEffect(() => {
        setCategoriaId(presupuesto.category_id);
        setMonto(presupuesto.monthly_budget);
    }, [presupuesto]);

    if (!showModal) return null;

    async function handleAceptar() {
        const updated: PresupuestoTipo = {
        ...presupuesto,
        category_id: categoriaId,
        monthly_budget: monto === "" ? 0 : Number(monto),
    };
        await actualizarPresupuesto(updated);
        onUpdate();
        handleClose();
    }

    function handleClose() {
        closeModal();   
    }
    
    return (
        <div
            className="modal fade show d-flex align-items-center justify-content-center"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="modal-content rounded-5">
                    <div className="modal-header d-flex justify-content-center w-100 border-0">
                        <h4 className="modal-title">Editar Presupuesto</h4>
                    </div>
                    <form>
                        <div className="modal-body">
                            <div className="mb-3 d-flex align-items-center">
                                <label className="form-label me-3 ms-2" style={{ minWidth: "120px" }}>
                                    <strong>Categoria</strong>
                                </label>
                                <select
                                    name="category_id"
                                    className="form-select"
                                    style={{ width: "200px" }}
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                                >
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <label className="form-label me-3 ms-2" style={{ minWidth: "120px" }}>
                                    <strong>Monto</strong>
                                </label>
                                <input
                                    type="number"
                                    name="monthly_budget"
                                    className="form-control"
                                    style={{ width: "200px" }}
                                    value={monto}
                                    onChange={(e) =>
                                    setMonto(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="modal-footer justify-content-center border-0">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleAceptar}>
                            Aceptar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarPresupuestoModal;