import { Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import Barra from "../components/BarraAdmin"
import DashboardAdmin from "./Dashboard"
import ListUsers from "./ListUsers"
import Historial from "./Historial"
import Configuracion from "./Configuracion"

const AppAdmin: React.FC = () => {
    return (
        <div className="d-flex">
        <Barra/>
        <div className="w-100 p-3">
          <Routes>
            <Route path="dashboard" element={<DashboardAdmin/>} />
            <Route path="usuarios" element={<ListUsers/>} />
            <Route path="historial" element={<Historial/>} />
            <Route path="configuracion" element={<Configuracion/>} />
          </Routes>
        </div>
      </div>
    )
}

export default AppAdmin