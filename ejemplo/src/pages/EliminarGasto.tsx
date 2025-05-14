// src/pages/EliminarGasto.tsx
import React from "react";
import { eliminarGasto } from "../services/GastoService";

interface EliminarGastoProp {
  closeModal: () => void;
  onDelete: () => void;
  gastoId?: number;
}

const EliminarGasto: React.FC<EliminarGastoProp> = ({
  closeModal,
  onDelete,
  gastoId
}) => {
  async function handleDelete() {
    if (gastoId) {
      await eliminarGasto(gastoId);
      onDelete(); // recarga la lista
    }
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
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-center w-100">
            <h4 className="modal-title">Aviso!</h4>
          </div>
          <div className="modal-body text-center">
            <p>¿Estás seguro que deseas eliminar este registro?</p>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-secondary mx-3" onClick={closeModal}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary mx-3" onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarGasto;