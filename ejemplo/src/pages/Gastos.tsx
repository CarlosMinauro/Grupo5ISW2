import { useEffect, useState, useMemo } from "react";
import { obtenerGastos } from "../services/GastoService";
import { GastoTipo } from "../types/GastoTipo";
import FiltroGastos from "../components/FiltroGastos";
import ExportarGastoModal from "./ExportarGastoModal";
import ModalAddGasto from "./ModalAddGasto";
import EliminarGasto from "./EliminarGasto";
import { obtenerCategorias, CategoriaTipo } from "../services/CategoryService";
import EditarGasto from "./EditarGasto";
import { addAccessLog } from "./Login";
import { obtenerPresupuestos } from "../services/BudgetsService";
import AdvertenciaExcesoModal from "../components/AdvertenciaExcesoModal";
import { BudgetsTipo } from "../types/BudgetsTipo";

// Función para parsear fechas "YYYY-MM-DD" sin zona horaria
function parseDateYMD(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function Gastos() {
  const [lista, setLista] = useState<GastoTipo[]>([]);
  const [categorias, setCategorias] = useState<CategoriaTipo[]>([]);
  const [presupuestos, setPresupuestos] = useState<Pick<BudgetsTipo, 'monthly_budget' | 'category_id'>[]>([]);

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [minMonto, setMinMonto] = useState<number | null>(null);
  const [maxMonto, setMaxMonto] = useState<number | null>(null);
  const [filtroRec, setFiltroRec] = useState("");

  // Modals
  const [selectedGasto, setSelectedGasto] = useState<GastoTipo | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningData, setWarningData] = useState<{ categoria: string; presupuesto: number; gastoActual: number } | null>(null);

  // Ordenamiento
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">("none");

  useEffect(() => {
    cargarGastos();
    cargarCategorias();
    cargarPresupuestos();
  }, []);

  async function cargarGastos() {
    const gastosBD = await obtenerGastos();
    setLista(gastosBD);
    return gastosBD; // Devuelve la lista para usarla inmediatamente si es necesario
  }

  async function cargarCategorias() {
    const cats = await obtenerCategorias();
    setCategorias(cats);
  }

  async function cargarPresupuestos() {
    const presupuestosBD = await obtenerPresupuestos();
    setPresupuestos(presupuestosBD);
  }

  function getCategoryName(catId: number): string {
    const cat = categorias.find((c) => c.id === catId);
    return cat ? cat.name : String(catId);
  }

  function getCategoryIdByName(name: string): number | null {
    const cat = categorias.find((c) => c.name === name);
    return cat ? cat.id : null;
  }

  function verificarPresupuesto(gastos: GastoTipo[], categoriaId: number) {
    // Calcular el gasto total para la categoría específica
    const gastoActual = gastos
      .filter((g) => g.category_id === categoriaId)
      .reduce((sum, g) => sum + g.amount, 0);

    // Encontrar el presupuesto para esta categoría
    const presupuesto = presupuestos.find((p) => p.category_id === categoriaId);

    // Verificar si el gasto actual es >= 80% del presupuesto
    if (presupuesto && gastoActual >= presupuesto.monthly_budget * 0.8) {
      setWarningData({
        categoria: getCategoryName(categoriaId),
        presupuesto: presupuesto.monthly_budget,
        gastoActual,
      });
      setShowWarning(true);
    }
  }

  const cerrarAdvertencia = () => {
    setShowWarning(false);
    setWarningData(null);
  }

  // Función para manejar ordenamiento al hacer clic en un encabezado
  function handleSort(col: string) {
    if (sortedColumn !== col) {
      setSortedColumn(col);
      setSortDirection("asc");
    } else {
      if (sortDirection === "none") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
      }
    }
  }

  // Función que compara dos gastos según la columna y la dirección
  function compareGastos(a: GastoTipo, b: GastoTipo, col: string, dir: "asc" | "desc") {
    let valA: any;
    let valB: any;
    switch (col) {
      case "fecha":
        valA = parseDateYMD(a.date).getTime();
        valB = parseDateYMD(b.date).getTime();
        break;
      case "monto":
        valA = a.amount;
        valB = b.amount;
        break;
      case "descripcion":
        valA = a.description.toLowerCase();
        valB = b.description.toLowerCase();
        break;
      case "recurrente":
        valA = a.recurring ? 1 : 0;
        valB = b.recurring ? 1 : 0;
        break;
      case "categoria":
        valA = getCategoryName(a.category_id).toLowerCase();
        valB = getCategoryName(b.category_id).toLowerCase();
        break;
      default:
        valA = 0;
        valB = 0;
    }
    if (valA < valB) return dir === "asc" ? -1 : 1;
    if (valA > valB) return dir === "asc" ? 1 : -1;
    return 0;
  }

  // Icono de ordenamiento para mostrar en la cabecera
  function renderSortIcon(col: string) {
    if (sortedColumn !== col || sortDirection === "none") {
      return "⇅";
    }
    if (sortDirection === "asc") return "▲";
    if (sortDirection === "desc") return "▼";
    return "⇅";
  }

  // Filtrado local y luego ordenamiento
  const datosFiltrados = useMemo(() => {
    let filtrados = lista.filter((g) => {
      let cOk = true;
      if (filtroCategoria) {
        const catId = getCategoryIdByName(filtroCategoria);
        cOk = catId != null && g.category_id === catId;
      }
      let fOk = !filtroFecha || g.date === filtroFecha;
      let mOk = true;
      if (minMonto !== null && g.amount < minMonto) mOk = false;
      if (maxMonto !== null && g.amount > maxMonto) mOk = false;
      let rOk = true;
      if (filtroRec === "si") rOk = g.recurring === true;
      if (filtroRec === "no") rOk = g.recurring === false;
      return cOk && fOk && mOk && rOk;
    });

    if (sortedColumn && sortDirection !== "none") {
      filtrados = [...filtrados].sort((a, b) =>
        compareGastos(a, b, sortedColumn, sortDirection)
      );
    }
    return filtrados;
  }, [lista, filtroCategoria, filtroFecha, minMonto, maxMonto, filtroRec, sortedColumn, sortDirection, categorias]);

  function handleDeleteClick(g: GastoTipo) {
    setSelectedGasto(g);
    setIsDeleteModalOpen(true);
  }

  function handleEditClick(g: GastoTipo) {
    setSelectedGasto(g);
    setIsEditModalOpen(true);
  }

  function handleAddClick() {
    setIsAddModalOpen(true);
  }

  // Función para agregar gasto
  const addGastoHandler = async (
    ng_fecha: string,
    ng_categoria: number,
    ng_recurrente: boolean,
    ng_monto: number,
    ng_descripcion: string
  ) => {
    const ng_date = new Date(ng_fecha);

    const gastoData = {
      date: ng_date,
      amount: ng_monto,
      description: ng_descripcion,
      recurring: ng_recurrente,
      category_id: ng_categoria
    };
    const user = sessionStorage.getItem("user");
    let token = "";

    if (user) {
      const userInfo = JSON.parse(user);
      token = userInfo.token;
    }

    const resp = await fetch(import.meta.env.VITE_API_URL + "/add-gasto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(gastoData)
    });
    const data = await resp.json();

    if (data.msg === "") {
      const gastosActualizados = await cargarGastos(); // Recargar la lista de gastos
      verificarPresupuesto(gastosActualizados, ng_categoria); // Verificar solo la categoría afectada
    } else {
      console.log("Error al agregar gasto");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mis Gastos</h2>
      {showWarning && warningData && (
        <AdvertenciaExcesoModal
          showModal={showWarning}
          closeModal={cerrarAdvertencia}
          categoria={warningData.categoria}
          presupuesto={warningData.presupuesto}
          gastoActual={warningData.gastoActual}
        />
      )}

      <div className="d-flex justify-content-between align-items-center my-3">
        <FiltroGastos
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          filtroFecha={filtroFecha}
          setFiltroFecha={setFiltroFecha}
          minMonto={minMonto}
          setMinMonto={setMinMonto}
          maxMonto={maxMonto}
          setMaxMonto={setMaxMonto}
          filtroRec={filtroRec}
          setFiltroRec={setFiltroRec}
        />
        <div>
          <button className="btn btn-primary me-2" onClick={handleAddClick}>
            + Agregar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsExportModalOpen(true)}
          >
            Exportar Gastos
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("fecha")}>
              Fecha {renderSortIcon("fecha")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("monto")}>
              Monto {renderSortIcon("monto")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("descripcion")}>
              Descripción {renderSortIcon("descripcion")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("recurrente")}>
              Recurrente {renderSortIcon("recurrente")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("categoria")}>
              Categoría {renderSortIcon("categoria")}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datosFiltrados.map((g) => (
            <tr key={g.id}>
              <td>{g.date}</td>
              <td>{g.amount}</td>
              <td>{g.description}</td>
              <td>{g.recurring ? "Sí" : "No"}</td>
              <td>{getCategoryName(g.category_id)}</td>
              <td>
                <button
                  onClick={() => handleEditClick(g)}
                  className="btn btn-warning btn-sm me-2"
                >
                  <i className="bi bi-pencil-square" />
                </button>
                <button
                  onClick={() => handleDeleteClick(g)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash" />
                </button>
              </td>
            </tr>
          ))}
          {datosFiltrados.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                No hay registros
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Exportar Modal */}
      {isExportModalOpen && (
        <ExportarGastoModal
          closeModal={() => setIsExportModalOpen(false)}
          onExport={() => setIsExportModalOpen(false)}
          data={lista}
        />
      )}

      {/* Editar Modal */}
      {isEditModalOpen && selectedGasto && (
        <EditarGasto
          id={selectedGasto.id}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={() => {
            cargarGastos();
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Eliminar Modal */}
      {isDeleteModalOpen && selectedGasto && (
        <EliminarGasto
          closeModal={() => setIsDeleteModalOpen(false)}
          onDelete={() => {
            cargarGastos();
            setIsDeleteModalOpen(false);
          }}
          gastoId={selectedGasto.id}
        />
      )}

      {/* Agregar Modal */}
      {isAddModalOpen && (
        <ModalAddGasto
          showModal={isAddModalOpen}
          closeModal={() => setIsAddModalOpen(false)}
          onAddGasto={async (fecha, categoria, recurrente, monto, descripcion) => {
            await addGastoHandler(fecha, categoria, recurrente, monto, descripcion);
            addAccessLog("Agregar Gasto");
          }}
          categorias={categorias}
        />
      )}
    </div>
  );
}

export default Gastos;
