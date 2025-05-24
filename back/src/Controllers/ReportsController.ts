import express, { Request, Response } from "express";
import { Op, fn, col, literal } from "sequelize";
const jwt = require("jsonwebtoken");
const db = require("../DAO/models"); // Ajusta la ruta según tu estructura

const ReportsController = () => {
  const path = "/reports";
  const router = express.Router();

  // 1) Reporte de Gastos Mensuales
  router.get("/monthly", async (req: Request, res: Response): Promise<any> => {
    try {
      // Verificar token
      const authorization = req.get("authorization") || "";
      const token = authorization.toLowerCase().startsWith("bearer ")
        ? authorization.substring(7)
        : "";
      const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
      if (!decodedToken.id) {
        return res.status(401).json({ error: "token missing or invalid" });
      }

      // Consulta: sumar amount y agrupar por mes (DATE_TRUNC)
      // Nota: raw: true para que devuelva objetos simples
      const results = await db.Expenses.findAll({
        attributes: [
          // DATE_TRUNC('month', "Expenses"."date") como "mes"
          [fn("DATE_TRUNC", "month", col("date")), "mes"],
          [fn("SUM", col("amount")), "total"]
        ],
        where: { user_id: decodedToken.id },
        group: [literal(`DATE_TRUNC('month', "Expenses"."date")`)],
        order: [literal(`DATE_TRUNC('month', "Expenses"."date") ASC`)],
        raw: true
      });

      return res.json({ msg: "", data: results });
    } catch (error) {
      console.error("GET /reports/monthly Error:", error);
      return res.status(500).json({ msg: "Error al obtener reporte mensual" });
    }
  });

  // 2) Reporte de Gastos por Categoría
  router.get("/category", async (req: Request, res: Response): Promise<any> => {
    try {
      // Verificar token
      const authorization = req.get("authorization") || "";
      const token = authorization.toLowerCase().startsWith("bearer ")
        ? authorization.substring(7)
        : "";
      const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
      if (!decodedToken.id) {
        return res.status(401).json({ error: "token missing or invalid" });
      }

      // Sumar amount y agrupar por categoría
      // Incluimos la tabla "Categories" para obtener el nombre
      // group: ['Expenses.category_id', 'category.id'] -> así no falla la agrupación
      const results = await db.Expenses.findAll({
        attributes: [
          "category_id",
          [fn("SUM", col("amount")), "total"]
        ],
        where: { user_id: decodedToken.id },
        include: [
          {
            model: db.Categories,
            as: "category",  // Asegúrate de que en expenses.js belongsTo(models.Categories, { as: 'category' })
            attributes: ["name"]
          }
        ],
        group: ["Expenses.category_id", "category.id"],
        raw: true
      });

      // Ejemplo de salida con raw: true:
      // [
      //   {
      //     category_id: 1,
      //     total: 5000,
      //     "category.name": "Servicios"
      //   },
      //   ...
      // ]

      return res.json({ msg: "", data: results });
    } catch (error) {
      console.error("GET /reports/category Error:", error);
      return res.status(500).json({ msg: "Error al obtener reporte por categoría" });
    }
  });

  return [path, router];
};

export default ReportsController;