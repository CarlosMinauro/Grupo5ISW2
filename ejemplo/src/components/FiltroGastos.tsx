// src/components/FiltroGastos.tsx
import React from "react";

interface Props {
  filtroCategoria: string;
  setFiltroCategoria: (v: string) => void;
  filtroFecha: string;
  setFiltroFecha: (v: string) => void;
  minMonto: number | null;
  setMinMonto: (v: number | null) => void;
  maxMonto: number | null;
  setMaxMonto: (v: number | null) => void;
  filtroRec: string;
  setFiltroRec: (v: string) => void;
}

function FiltroGastos({
  filtroCategoria,
  setFiltroCategoria,
  filtroFecha,
  setFiltroFecha,
  minMonto,
  setMinMonto,
  maxMonto,
  setMaxMonto,
  filtroRec,
  setFiltroRec
}: Props) {
  function handleMin(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (!v) {
      setMinMonto(null)
      return
    }
    const n = parseFloat(v)
    setMinMonto(isNaN(n) ? null : n)
  }

  function handleMax(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (!v) {
      setMaxMonto(null)
      return
    }
    const n = parseFloat(v)
    setMaxMonto(isNaN(n) ? null : n)
  }

  return (
    <div className="row gx-2 gy-1">
      <div className="col-auto">
        <label className="form-label mb-0">Categoría:</label>
        <select
          className="form-select form-select-sm"
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Alimentacion">Alimentación</option>
          <option value="Servicios">Servicios</option>
          <option value="Ocio">Ocio</option>
          <option value="Comida">Comida</option>
          <option value="Transporte">Transporte</option>
          <option value="Salud">Salud</option>
          <option value="Entretenimiento">Entretenimiento</option>
          <option value="Estudios">Estudios</option>
          <option value="Regalos">Regalos</option>
        </select>
      </div>
      <div className="col-auto">
        <label className="form-label mb-0">Fecha exacta:</label>
        <input
          type="date"
          className="form-control form-control-sm"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
          placeholder="dd/mm/aaaa"
        />
      </div>
      <div className="col-auto">
        <label className="form-label mb-0">Rango de Monto:</label>
        <input
          type="number"
          className="form-control form-control-sm"
          value={minMonto === null ? "" : minMonto}
          onChange={handleMin}
          placeholder="Min"
        />
      </div>
      <div className="col-auto">
        <label></label>
        <input
          type="number"
          className="form-control form-control-sm"
          value={maxMonto === null ? "" : maxMonto}
          onChange={handleMax}
          placeholder="Max"
        />
      </div>
      <div className="col-auto">
        <label className="form-label mb-0">Recurrente:</label>
        <select
          className="form-select form-select-sm"
          value={filtroRec}
          onChange={e => setFiltroRec(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>
  )
}

export default FiltroGastos
