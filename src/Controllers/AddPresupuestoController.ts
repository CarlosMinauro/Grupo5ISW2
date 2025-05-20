import express, {Request, Response} from "express"
const db = require("../DAO/models")
const jwt = require("jsonwebtoken")

const AddPresupuestoController = () => {
    const path: string = "/add-presupuesto";

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

        const nuevoPresupuesto = req.body;

        const presupuestoCreado = await db.Budgets.create({
            id: null,
            user_id: decodedToken.id,
            monthly_budget: nuevoPresupuesto.monthly_budget,
            category_id: nuevoPresupuesto.category_id
        });

        res.json({
            msg: "",
            presupuesto: presupuestoCreado
        })
    });

    return [ path, router ];
}

export default AddPresupuestoController