import { useState } from "react"
import { Role } from "./AddUserModal"

interface FilterUserModalProps {
    roles: Role[]
    filterRole: number
    setFilterRole: (val: number) => void
    closeModal: () => void
    onApplyFilter: (role_id: number) => void
}

const FilterUserModal = (props: FilterUserModalProps) => {
  const [selectedRole, setSelectedRole] = useState(props.filterRole)

  return (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-center w-100 border-0">
            <h4 className="modal-title">Filtrar por rol de usuario</h4>
          </div>
          <div className="modal-body text-center">
            <div className="row gx-2 gy-1">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-3 ms-2" style={{ minWidth: "120px" }}>
                  <strong>Rol</strong>
                </label>
                <select
                    className="form-select form-select-sm"
                    style={{ width: "200px" }}
                    value={selectedRole}
                    onChange={(u) => setSelectedRole(Number(u.target.value))}
                >
                    <option value={0}>Todos</option>
                    {
                        props.roles.map((role : Role) => {
                            return <option key={String(role.id)} value={role.id}>
                                {role.name}
                            </option>
                        })
                    }
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer justify-content-center border-0">
            <button type="button" className="btn btn-secondary mx-3" onClick={() => props.closeModal()}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary mx-3" onClick={() => props.onApplyFilter( selectedRole )}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterUserModal;