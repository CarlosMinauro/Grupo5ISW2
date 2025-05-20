import express, {Request, Response} from "express"
const db = require("../DAO/models")
const jwt = require("jsonwebtoken")

const AddGastoController = () => {
    const path: string = "/add-gasto";

    const router = express.Router();

    // Endpoint para enviar categorias
    router.get('/categories', async (req: Request, res: Response) => {
        const categorias = await db.Categories.findAll()
        res.json({
            msg : "",
            categorias : categorias
        }) 
    });

    // Endpoint para enviar gastos
    router.post('/', async (req: Request, res: Response) => {
        const authorization = req.get("authorization");

        let token = '';

        if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
            token = authorization.substring(7);
        }

        let decodedToken = {} as any;

        try {
            decodedToken = jwt.verify(token, process.env.SECRET as string);
        } catch (e) {
            console.log(e);
        }

        console.log(decodedToken);

        if (!token || !decodedToken.id) {
            res.status(401).json({error: 'token missing or invalid'});
            return;
        }

        const nuevoGasto = req.body;

        const gastoCreado = await db.Expenses.create({
            id: null,
            user_id: decodedToken.id,
            date: nuevoGasto.date,
            amount: nuevoGasto.amount,
            description: nuevoGasto.description,
            recurring: nuevoGasto.recurring,
            category_id: nuevoGasto.category_id
        });

        res.json({
            msg: "",
            gasto: gastoCreado
        })
    });

    return [ path, router ];
}

export default AddGastoController;