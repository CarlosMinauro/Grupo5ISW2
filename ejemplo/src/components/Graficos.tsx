// src/pages/Graficos.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { GastoTipo } from "../types/GastoTipo";
import { CategoriaTipo, obtenerCategorias } from "../services/CategoryService";
import { obtenerGastos } from "../services/GastoService";

// Función para parsear fechas "YYYY-MM-DD" sin que la zona horaria afecte el mes
function parseDateYMD(dateStr: string): Date {
  // "2025-03-23"
  const [year, month, day] = dateStr.split("-").map(Number);
  // new Date(año, mesIndex, día) -> mesIndex = month - 1
  return new Date(year, month - 1, day);
}

const Graficos: React.FC = () => {
  const [gastos, setGastos] = useState<GastoTipo[]>([]);
  const [categorias, setCategorias] = useState<CategoriaTipo[]>([]);

  // Al montar, cargamos gastos y categorías
  useEffect(() => {
    async function cargar() {
      const dataGastos = await obtenerGastos();
      setGastos(dataGastos);
      const dataCats = await obtenerCategorias();
      setCategorias(dataCats);
    }
    cargar();
  }, []);

  // Helper: Dado un category_id, retorna el nombre de la categoría
  function getCategoryName(catId: number): string {
    const cat = categorias.find((c) => c.id === catId);
    return cat ? cat.name : `Cat ${catId}`;
  }

  // 1) DATOS MENSUALES
  const datosMes = useMemo(() => {
    // Mapa mes => suma
    const mapaMes: Record<string, number> = {
      Ene: 0, Feb: 0, Mar: 0, Abr: 0, May: 0, Jun: 0,
      Jul: 0, Ago: 0, Sep: 0, Oct: 0, Nov: 0, Dic: 0
    };
    const nombres = Object.keys(mapaMes); // ["Ene","Feb",...]

    gastos.forEach((g) => {
      const date = parseDateYMD(g.date); // Evita desfase de mes
      const mesIndex = date.getMonth();  // 0=Ene,1=Feb,...
      const mes = nombres[mesIndex] || "?";
      mapaMes[mes] += g.amount;
    });

    return {
      labels: Object.keys(mapaMes),
      datasets: [
        {
          label: "Gastos mensuales",
          data: Object.values(mapaMes),
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        }
      ]
    };
  }, [gastos]);

  // 2) DATOS POR CATEGORÍA
  const datosCat = useMemo(() => {
    // Mapa nombreCategoria => suma
    const mapaCat: Record<string, number> = {};

    gastos.forEach((g) => {
      const nombre = getCategoryName(g.category_id);
      mapaCat[nombre] = (mapaCat[nombre] || 0) + g.amount;
    });

    return {
      labels: Object.keys(mapaCat),
      datasets: [
        {
          label: "Gastos por categoría",
          data: Object.values(mapaCat),
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        }
      ]
    };
  }, [gastos, categorias]);

  return (
    <div className="row">
      <h3 className="mb-4">Panel de control</h3>
      {/* Gráfico 1: Gastos mensuales */}
      <div className="col-md-6 mb-3">
        <div className="p-3 border rounded">
          <h4 className="text-center">Gastos mensuales</h4>
          <Bar data={datosMes} />
        </div>
      </div>

      {/* Gráfico 2: Gastos por categoría */}
      <div className="col-md-6 mb-3">
        <div className="p-3 border rounded">
          <h4 className="text-center">Gastos por categoría</h4>
          <Bar data={datosCat} />
        </div>
      </div>
    </div>
  );
};

export default Graficos;
