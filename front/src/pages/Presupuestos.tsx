import { useEffect } from "react";
import { PresupuestoTipo } from "../types/PresupuestoTypes";
import { usePresupuestoOperations } from "../hooks/usePresupuestoOperations";
import { usePresupuestoWarning } from "../hooks/usePresupuestoWarning";
import { usePresupuestoCategories } from "../hooks/usePresupuestoCategories";
import { usePresupuestoStore } from "../store/presupuestoStore";
import PresupuestoList from "../components/PresupuestoList";

import AgregarPresupuestoModal from "./AgregarPresupuestoModal";
import EliminarPresupuestoModal from "./EliminarPresupuestoModal";
import EditarPresupuestoModal from "./EditarPresupuestoModal";
import AdvertenciaExcesoModal from "../components/AdvertenciaExcesoModal";

/**
 * SRP (Principio de Responsabilidad Única):
 * Este componente tiene una única responsabilidad: renderizar la UI
 * y coordinar las interacciones del usuario. No contiene lógica de negocio.
 * 
 * DIP (Principio de Inversión de Dependencias):
 * - Depende de hooks abstractos en lugar de implementaciones concretas
 * - Usa el store como abstracción para el estado
 * - Los componentes modales son inyectados como dependencias
 */
function Presupuestos() {
    // Hooks para operaciones y lógica de negocio
    const {
        getPresupuestos,
        addPresupuesto,
        updatePresupuesto,
        deletePresupuesto
    } = usePresupuestoOperations();

    const {
        categorias,
        cargarCategorias,
        getCategoryName
    } = usePresupuestoCategories();

    const {
        checkWarning,
        dismissWarning,
        warningData
    } = usePresupuestoWarning();

    // Estado global a través del store
    const {
        presupuestos,
        selectedPresupuesto,
        warningData: storeWarningData,
        modals,
        setSelectedPresupuesto,
        setModalState,
        setWarningData
    } = usePresupuestoStore();

    /**
     * ISP (Principio de Segregación de Interfaces):
     * Esta función expone solo la funcionalidad necesaria para cargar datos.
     * No fuerza a los componentes a implementar lógica innecesaria.
     */
    const cargarDatos = async () => {
        const presupuestos = await getPresupuestos();
        await cargarCategorias();
        const warning = await checkWarning();
        if (warning) {
            setWarningData(warning);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    /**
     * LSP (Principio de Sustitución de Liskov):
     * Los manejadores de eventos son consistentes y predecibles.
     * Cualquier componente que use estos manejadores puede confiar
     * en su comportamiento.
     */
    function handleDelete(p: PresupuestoTipo) {
        setSelectedPresupuesto(p);
        setModalState('delete', true);
    }

    function handleEdit(p: PresupuestoTipo) {
        setSelectedPresupuesto(p);
        setModalState('edit', true);
    }

    function handleAddClick() {
        setModalState('add', true);
    }

    return (
        <div className="table-section" style={{ minHeight: "80vh" }}>
            {storeWarningData && (
                <AdvertenciaExcesoModal
                    showModal={true}
                    closeModal={dismissWarning}
                    categoria={storeWarningData.categoria}
                    presupuesto={storeWarningData.presupuesto}
                    gastoActual={storeWarningData.gastoActual}
                />
            )}
            <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                <h2 className="table-title m-0">Mis Presupuestos</h2>
                <div className="d-flex flex-row">
                    <button onClick={handleAddClick} className="btn btn-primary btn-lg me-4 d-flex align-items-center">
                        Agregar
                    </button>
                </div>
            </div>

            <PresupuestoList
                lista={presupuestos}
                getCategoryName={getCategoryName}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {modals.edit && selectedPresupuesto && (
                <EditarPresupuestoModal
                    showModal={modals.edit}
                    closeModal={() => setModalState('edit', false)}
                    onUpdate={async () => {
                        await cargarDatos();
                        setModalState('edit', false);
                    }}
                    presupuesto={selectedPresupuesto}
                    categorias={categorias}
                />
            )}

            {modals.delete && selectedPresupuesto && (
                <EliminarPresupuestoModal
                    closeModal={() => setModalState('delete', false)}
                    onDelete={async () => {
                        await deletePresupuesto(selectedPresupuesto.id);
                        await cargarDatos();
                        setModalState('delete', false);
                    }}
                    presupuestoId={selectedPresupuesto.id}
                />
            )}

            {modals.add && (
                <AgregarPresupuestoModal
                    showModal={modals.add}
                    closeModal={() => setModalState('add', false)}
                    onAddPresupuesto={async (monthly_budget, categoria) => {
                        await addPresupuesto({
                            monthly_budget,
                            category_id: categoria
                        });
                        await cargarDatos();
                        setModalState('add', false);
                    }}
                    categorias={categorias}
                />
            )}
        </div>
    );
}

export default Presupuestos;