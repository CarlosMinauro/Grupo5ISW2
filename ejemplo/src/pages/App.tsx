import { Routes, Route } from "react-router-dom"
import BarraLateral from "../components/BarraLateral"
import Gastos from "./Gastos"
import Dashboard from "./Tablas"
import "bootstrap/dist/css/bootstrap.min.css"
import Presupuestos from "./Presupuestos"
import Configuracion from "./Configuracion"

const App: React.FC = () => {
  return (
    <div className="d-flex">
      <BarraLateral />
      <div className="w-100 p-3">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="gastos" element={<Gastos />} />
          <Route path="presupuestos" element={<Presupuestos />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
