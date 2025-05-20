import React from "react";
import { eliminarPresupuesto } from "../services/PresupuestoService";

interface EliminarPresupuestoModalProps {
    closeModal: () => void;
    onDelete: () => void;
    presupuestoId?: number;
}

const EliminarPresupuestoModal : React.FC<EliminarPresupuestoModalProps> = ({
    closeModal,
    onDelete,
    presupuestoId
}) => {
    async function handleDelete() {
        if (presupuestoId) {
            await eliminarPresupuesto(presupuestoId);
            onDelete();
        }
        closeModal();
    }

    return (
        <div className="modal fade show d-flex align-items-center justify-content-center"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", minHeight: "100vh" }} aria-modal="true" role="dialog">
            <div className="modal-dialog" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-center w-100">
                        <h4 className="modal-title">Aviso!</h4>
                    </div>
                    <div className="modal-body text-center">
                        <p>¿Estás seguro que deseas eliminar este presupuesto?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary mx-3" onClick={closeModal}>Cancelar</button>
                        <button type="button" className="btn btn-primary mx-3" onClick={handleDelete}>Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default EliminarPresupuestoModal