import { useState } from "react"

export interface Categoria {
  id: number
  name: string
}

interface MAGProps {
  showModal: boolean
  closeModal: () => void
  onAddGasto: (fecha: string, categoria: number, recurrente: boolean, monto: number, descripcion: string) => void
  categorias: Categoria[]
}

const ModalAddGasto = (props: MAGProps) => {
  const [fecha, setFecha] = useState("");
  const [categoria, setCategoria] = useState<number>(1);
  const [recurrente, setRecurrente] = useState(false);
  const [monto, setMonto] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState("");

  const fechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(e.target.value);
  }

  const categoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(Number(e.target.value));
  }

  const recurrenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecurrente(e.target.checked);
  }

  const montoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMonto(val === "" ? "" : Number(val));
  }

  const descripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescripcion(e.target.value);
  }

  const aceptarClick = () => {
    // Validar campos requeridos
    if (!fecha) {
      alert("Por favor ingrese una fecha");
      return;
    }
    if (!monto || monto <= 0) {
      alert("Por favor ingrese un monto válido mayor a 0");
      return;
    }
    if (!descripcion.trim()) {
      alert("Por favor ingrese una descripción");
      return;
    }

    props.onAddGasto(fecha, categoria, recurrente, monto, descripcion);
    setFecha("");
    setCategoria(0);
    setRecurrente(false);
    setMonto("");
    setDescripcion("");
    props.closeModal();
  }

  return (
    <div
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      className={props.showModal ? "modal fade show d-block" : "modal fade"}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-5 shadow overflow-hidden">
          <div className="modal-body p-5 text-secondary-emphasis">
            <h3 className="text-center mb-4 fw-bold">Agregar gasto</h3>
            <form className="d-flex flex-column gap-3" onSubmit={(e) => { e.preventDefault(); aceptarClick(); }}>
              <div className="d-flex align-items-center">
                <label className="col-4 fw-bold fs-5">Fecha *</label>
                <input
                  className="form-control w-100 text-body-secondary"
                  type="date"
                  value={fecha}
                  onChange={fechaChange}
                  required
                />
              </div>
              <div className="d-flex align-items-center">
                <label className="col-4 fw-bold fs-5">Categoria *</label>
                <select
                  className="form-select w-100 text-body-secondary"
                  value={categoria}
                  onChange={categoriaChange}
                  required
                >
                  {
                    props.categorias.map((c: Categoria) => {
                      return <option key={c.id} value={c.id}>{c.name}</option>
                    })
                  }
                </select>
              </div>
              <div className="d-flex align-items-center">
                <label className="col-4 fw-bold fs-5">Recurrente</label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={recurrente}
                  onChange={recurrenteChange}
                />
              </div>
              <div className="d-flex align-items-center">
                <label className="col-4 fw-bold fs-5">Monto *</label>
                <input
                  className="form-control w-100 text-body-secondary"
                  type="number"
                  value={monto}
                  onChange={montoChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="d-flex align-items-start mt-2">
                <label className="col-4 fw-bold fs-5">Descripcion *</label>
                <textarea
                  className="form-control flex-grow-1"
                  rows={4}
                  placeholder="Escriba aquí el detalle"
                  value={descripcion}
                  onChange={descripcionChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-between mt-3 mx-5">
                <button
                  style={{ width: "45%" }}
                  type="button"
                  className="btn btn-secondary px-4 fw-semibold"
                  onClick={() => {
                    setFecha("");
                    setCategoria(0);
                    setRecurrente(false);
                    setMonto("");
                    setDescripcion("");
                    props.closeModal();
                  }}
                >
                  Cancelar
                </button>
                <button
                  style={{ width: "45%" }}
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                >
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalAddGasto