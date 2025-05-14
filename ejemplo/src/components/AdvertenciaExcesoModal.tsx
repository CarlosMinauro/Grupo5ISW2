import React from "react";

interface AdvertenciaExcesoModalProps {
  showModal: boolean;
  closeModal: () => void;
  categoria: string;
  presupuesto: number;
  gastoActual: number;
}

const AdvertenciaExcesoModal: React.FC<AdvertenciaExcesoModalProps> = ({
  showModal,
  closeModal,
  categoria,
  presupuesto,
  gastoActual,
}) => {
  if (!showModal) return null;

  return (
    <div
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      className={showModal ? "modal fade show d-block" : "modal fade"}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-5 shadow overflow-hidden">
          <div className="modal-body p-5 text-secondary-emphasis">
            <h3 className="text-center mb-4">¡Advertencia de Presupuesto!</h3>
            <p className="text-center mb-4">
              Estás cerca o has superado tu presupuesto de <strong>{categoria}</strong>.
            </p>
            <p className="text-center mb-4">
              Presupuesto: <strong>${presupuesto.toFixed(2)}</strong>
            </p>
            <p className="text-center mb-4">
              Gasto actual: <strong>${gastoActual.toFixed(2)}</strong>
            </p>
            <div className="d-flex justify-content-center">
              <button
                style={{ width: "45%" }}
                type="button"
                className="btn btn-primary px-4 fw-semibold"
                onClick={closeModal}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertenciaExcesoModal;