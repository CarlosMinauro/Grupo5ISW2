import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
const db = require("../DAO/models");

const BudgetsController = (): [string, Router] => {
    const path: string = "/budgets";
    const router = express.Router();

    // GET /budgets - Obtener todos los presupuestos
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
                
                const presupuestos = await db.Budgets.findAll({ where: { user_id: decodedToken.id } });
                res.json({ msg: "", presupuestos });
            } catch (error) {
                console.error("GET /budgets Error:", error);
                res.status(500).json({ msg: "Error al obtener presupuestos" });
            }
    });

    // POST /budgets - Crear un presupuesto
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
                  
                const { monthly_budget, category_id } = req.body;
                const presupuestoCreado = await db.Budgets.create({
                    user_id: decodedToken.id,
                    monthly_budget,
                    category_id,
                });

                res.json({ msg: "", presupuesto: presupuestoCreado });
            } catch (error) {
                console.error("POST /budgets Error:", error);
                res.status(500).json({ msg: "Error al crear presupuesto" });
            }
    });

    // PUT /budgets/:id - Actualizar un presupuesto
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

            const presupuesto = await db.Budgets.findOne({ where: { id, user_id: decodedToken.id } });
            if (!presupuesto) {
                res.status(404).json({ msg: "Presupuesto no encontrado" });
                return;
            }

            await presupuesto.update(req.body);
            res.json({ msg: "", presupuesto });
        } catch (error) {
            console.error("PUT /budgets/:id Error:", error);
            res.status(500).json({ msg: "Error al actualizar presupuesto" });
        }
    });

    // DELETE /budgets/:id - Eliminar un presupuesto
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

            const presupuesto = await db.Budgets.findOne({ where: { id, user_id: decodedToken.id } });
            if (!presupuesto) {
                res.status(404).json({ msg: "Presupuesto no encontrado" });
                return;
            }

            await presupuesto.destroy();
            res.json({ msg: "", presupuesto });
        } catch (error) {
            console.error("DELETE /budgets/:id Error:", error);
            res.status(500).json({ msg: "Error al eliminar presupuesto" });
        }
    });

    return [path, router];
};

export default BudgetsController;




            