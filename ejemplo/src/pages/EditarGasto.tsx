import React, { useEffect, useState } from "react"
import { obtenerGastos, editGasto } from "../services/GastoService"
import { GastoTipo } from "../types/GastoTipo";



interface Props {
  id: number | null
  onClose: () => void
  onUpdate: () => void

}

const EditarGasto = ({ id, onClose, onUpdate}: Props) => {
  const [dato, setDato] = useState<GastoTipo | null>(null)

  useEffect(() => {
    if (!id) return
    
    const cargarDatos = async () => {
      try {
        const gastos = await obtenerGastos()
        const enc = gastos.find(gasto => gasto.id === id)
        if (!enc) {
          onClose()
          return
        }
        setDato(enc)
      } catch (error) {
        console.error("Error al obtener el gasto:", error)
        onClose()
      }
    }
    
    cargarDatos()
  }, [id, onClose])
        
  function cambio(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!dato) return
    let val: string | number | boolean = e.target.value
    if (e.target.name === "amount") val = parseFloat(val as string) || 0
    if (e.target.name === "recurring") val = (e.target as HTMLInputElement).checked
    setDato({ ...dato, [e.target.name]: val })
  }

  async function enviar() {
    if (!dato) return
    try {
      await editGasto(dato)
      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error al actualizar el gasto:", error)
    }
  }

  if (!id || !dato) return null

  return (
    <div className=  "modal-overlay">
      <div className="modal-contenido">
        <button className="cerrar-modal" onClick={onClose}>&times;</button>
        <h2>Editar Gasto</h2>
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Fecha</label>
            <input type="date" name="date" className="form-control" value={dato.date} onChange={cambio} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Monto</label>
            <input type="number" name="amount" className="form-control" value={dato.amount} onChange={cambio} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Categoría</label>
            <select name="category_id" className="form-select" value={dato.category_id} onChange={cambio}>
              <option value="1">Servicios</option>
              <option value="2">Alimentación</option>
              <option value="3">Ocio</option>
              <option value="4">Comida</option>
              <option value="5">Transporte</option>
              <option value="6">Salud</option>
              <option value="7">Entretenimiento</option>
              <option value="8">Estudios</option>
              <option value="9">Regalos</option>
            </select>
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <label className="form-label me-2 mb-0">Recurrente</label>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" name="recurring" checked={dato.recurring} onChange={cambio} />
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Descripción</label>
            <input type="text" name="description" className="form-control" value={dato.description} onChange={cambio} />
          </div>
          
          <div className="col-12">
            <button type="button" className="btn btn-primary" onClick={enviar}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarGasto
