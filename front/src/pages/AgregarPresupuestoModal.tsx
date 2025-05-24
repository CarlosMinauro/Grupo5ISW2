import React, { useState } from "react"

export interface Categoria {
    id: number
    name: string
}

interface AgregarPresupuestoModalProps {
    showModal: boolean
    closeModal: () => void
    onAddPresupuesto: (monthly_budget : number, categoria : number) => void
    categorias: Categoria[] 
}

const AgregarPresupuestoModal = (props: AgregarPresupuestoModalProps) => {
    const [categoria, setCategoria] = useState<number>(1);
    const [monthly_budget, setMonthlyBudget] = useState<number | "">("");

    const categoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoria(Number(e.target.value));
    }

    const monthlyBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setMonthlyBudget(val === "" ? "" : Number(val));
    }

    const aceptarClick = () => {
        setCategoria(0);
        setMonthlyBudget("");
        props.closeModal();
      }

    return (
        <div style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        className={props.showModal ? "modal fade show d-block" : "modal fade"}
        tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-5 shadow overflow-hidden">
                    <div className="modal-body p-5 text-secondary-emphasis">
                        <h3 className="text-center mb-4 fw-bold">Agregar Presupuesto</h3>
                        <form className="d-flex flex-column gap-3"> 
                            <div className="d-flex align-items-center">
                                <label className="col-4 fw-bold fs-5">Categoria</label>
                                <select
                                    className="form-select"
                                    style={{ width: "200px" }}
                                    value={categoria}
                                    onChange={categoriaChange}
                                    >                                  
                                    {
                                        props.categorias.map((c: Categoria) => {
                                            return <option key={c.id} value={c.id}>{c.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="d-flex align-items-center">
                                <label className="col-4 fw-bold fs-5">Monto</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    style={{ width: "200px" }}
                                    value={monthly_budget}
                                    onChange={monthlyBudgetChange}
                                />
                            </div>
                            <div className="d-flex justify-content-between mt-3 mx-5">
                                <button
                                    style={{ width: "45%" }}
                                    type="button"
                                    className="btn btn-secondary px-4 fw-semibold"
                                    onClick={() => {
                                        setCategoria(0);
                                        setMonthlyBudget("");
                                        props.closeModal();
                                    }}
                                >
                                Cancelar
                                </button>
                                <button
                                    style={{ width: "45%" }}
                                    type="button"
                                    className="btn btn-primary px-4 fw-semibold"
                                    onClick={() => {
                                        props.onAddPresupuesto(monthly_budget === "" ? 0 : monthly_budget, categoria);
                                        aceptarClick();
                                    }}
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

export default AgregarPresupuestoModal