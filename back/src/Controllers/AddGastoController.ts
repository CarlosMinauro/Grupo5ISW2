import express, { Request, Response } from "express";
import { Expenses, Categories } from "../DAO/models";
import jwt from "jsonwebtoken";

const AddGastoController = () => {
    const path: string = "/add-gasto";
    const router = express.Router();

    // Endpoint para enviar categorias
    router.get('/categories', async (req: Request, res: Response) => {
        try {
            const categorias = await Categories.findAll();
            res.json({
                msg: "",
                categorias: categorias
            });
        } catch (error) {
            console.error("GET /categories Error:", error);
            res.status(500).json({ msg: "Error al obtener categorías" });
        }
    });

    // Endpoint para enviar gastos
    router.post('/', async (req: Request, res: Response) => {
        try {
            const authorization = req.get("authorization") || "";
            const token = authorization.toLowerCase().startsWith("bearer ")
                ? authorization.substring(7)
                : "";

            if (!token) {
                res.status(401).json({ error: "token missing" });
                return;
            }

            const decodedToken = jwt.verify(token, process.env.SECRET as string) as { id: number };
            if (!decodedToken.id) {
                res.status(401).json({ error: "token invalid" });
                return;
            }

            const { date, amount, description, recurring, category_id } = req.body;

            // Validate required fields
            if (!date) {
                res.status(400).json({ msg: "La fecha es requerida" });
                return;
            }

            if (!amount || amount <= 0) {
                res.status(400).json({ msg: "El monto es requerido y debe ser mayor a 0" });
                return;
            }

            if (!category_id) {
                res.status(400).json({ msg: "La categoría es requerida" });
                return;
            }

            const gastoCreado = await Expenses.create({
                user_id: decodedToken.id,
                date: new Date(date),
                amount,
                description: description || '',
                recurring: recurring || false,
                category_id
            });

            res.json({
                msg: "",
                gasto: gastoCreado
            });
        } catch (error) {
            console.error("POST /add-gasto Error:", error);
            res.status(500).json({ msg: "Error al crear gasto" });
        }
    });

    return [path, router];
};

export default AddGastoController;