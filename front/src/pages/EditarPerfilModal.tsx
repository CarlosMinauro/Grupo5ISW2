// src/pages/EditarPerfilModal.tsx

import React, { useState } from 'react';
import { ConfiguracionTipo } from '../types/ConfiguracionTipo';

interface EditarPerfilModalProps {
  configuracion: ConfiguracionTipo;
  closeModal: () => void;
  onSave: (configuracionActualizada: ConfiguracionTipo) => void;
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({ configuracion, closeModal, onSave }) => {
  const [configuracionData, setConfiguracionData] = useState<ConfiguracionTipo>(configuracion);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfiguracionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(configuracionData);
  };

  return (
    <div className="modal fade show d-flex align-items-center justify-content-center"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
      aria-modal="true" role="dialog">
      <div className="modal-dialog" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-center w-100">
            <h4 className="modal-title">Editar Información de Usuario</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={configuracionData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={configuracionData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={configuracionData.password}
                  onChange={handleChange}
                  placeholder="Dejar vacío para no cambiar"
                />
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-secondary mx-3" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary mx-3">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilModal;
