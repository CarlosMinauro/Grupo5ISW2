import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
const db = require("../DAO/models");

const ExpensesController = (): [string, Router] => {
  const path: string = "/expenses";
  const router = express.Router();

  // GET /expenses - Obtener todos los gastos
  router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
      const authorization = req.get("authorization") || "";
      const token = authorization.toLowerCase().startsWith("bearer ")
        ? authorization.substring(7)
        : "";

      const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
      if (!decodedToken.id) {
        res.status(401).json({ error: "token missing or invalid" });
        return;
      }

      const gastos = await db.Expenses.findAll({ where: { user_id: decodedToken.id } });
      res.json({ msg: "", gastos });
    } catch (error) {
      console.error("GET /expenses Error:", error);
      res.status(500).json({ msg: "Error al obtener gastos" });
    }
  });

  // POST /expenses - Crear un gasto
  router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
      const authorization = req.get("authorization") || "";
      const token = authorization.toLowerCase().startsWith("bearer ")
        ? authorization.substring(7)
        : "";

      const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
      if (!decodedToken.id) {
        res.status(401).json({ error: "token missing or invalid" });
        return;
      }

      const { date, amount, description, recurring, category_id } = req.body;
      const gastoCreado = await db.Expenses.create({
        user_id: decodedToken.id,
        date,
        amount,
        description,
        recurring,
        category_id,
      });

      res.json({ msg: "", gasto: gastoCreado });
    } catch (error) {
      console.error("POST /expenses Error:", error);
      res.status(500).json({ msg: "Error al crear gasto" });
    }
  });

  // PUT /expenses/:id - Actualizar un gasto
  router.put("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const authorization = req.get("authorization") || "";
      const token = authorization.toLowerCase().startsWith("bearer ")
        ? authorization.substring(7)
        : "";

      const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
      if (!decodedToken.id) {
        res.status(401).json({ error: "token missing or invalid" });
        return;
      }

      const gasto = await db.Expenses.findOne({ where: { id, user_id: decodedToken.id } });
      if (!gasto) {
        res.status(404).json({ msg: "Gasto no encontrado" });
        return;
      }

      await gasto.update(req.body);
      res.json({ msg: "", gasto });
    } catch (error) {
      console.error("PUT /expenses/:id Error:", error);
      res.status(500).json({ msg: "Error al actualizar gasto" });
    }
  });

  router.get("/", async (req: Request, res: Response):Promise<any> => {
    try {
      // 1) Verificar token
      const authorization = req.get("authorization") || "";
      const token = authorization.toLowerCase().startsWith("bearer ")
        ? authorization.substring(7)
        : "";
      const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
      if (!decodedToken.id) {
        return res.status(401).json({ error: "token missing or invalid" });
      }
  
      // 2) Tomar query params
      const { category, date, min, max } = req.query;
  
      // 3) Construir whereClause
      const whereClause: any = { user_id: decodedToken.id };
  
      if (category) {
        whereClause.category_id = category; // Debe coincidir con la tabla
      }
      if (date) {
        whereClause.date = date; // Date exacta
      }
      // Rango de montos
      if (min && max) {
        whereClause.amount = { [Op.between]: [parseFloat(min as string), parseFloat(max as string)] };
      } else if (min) {
        whereClause.amount = { [Op.gte]: parseFloat(min as string) };
      } else if (max) {
        whereClause.amount = { [Op.lte]: parseFloat(max as string) };
      }
  
      // 4) Buscar gastos
      const gastos = await db.Expenses.findAll({ where: whereClause });
      return res.json({ msg: "", gastos });
    } catch (error) {
      console.error("GET /expenses Error:", error);
      return res.status(500).json({ msg: "Error al obtener gastos" });
    }
  });

  // DELETE /expenses/:id - Eliminar un gasto
  router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const authorization = req.get("authorization") || "";
      const token = authorization.toLowerCase().startsWith("bearer ")
        ? authorization.substring(7)
        : "";

      const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
      if (!decodedToken.id) {
        res.status(401).json({ error: "token missing or invalid" });
        return;
      }

      const gasto = await db.Expenses.findOne({ where: { id, user_id: decodedToken.id } });
      if (!gasto) {
        res.status(404).json({ msg: "Gasto no encontrado" });
        return;
      }

      await gasto.destroy();
      res.json({ msg: "Gasto eliminado" });
    } catch (error) {
      console.error("DELETE /expenses/:id Error:", error);
      res.status(500).json({ msg: "Error al eliminar gasto" });
    }
  });
  

  return [path, router];
};




export default ExpensesController;