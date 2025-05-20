import express, {Request, Response} from "express"
const db = require("../DAO/models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const LoginController = () => {
    const path: string = "/login";

    const router = express.Router();

    // Endpoint para verificar usuario
    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await db.Usuario.findOne({
            where: { email: email }
        });

        if (!user) {
            res.json({
                msg: "Error en login"
            });
            return;
        }

        const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password_hash);

        const userForToken = {
            id: user.id,
            email: user.email,
            role_id: user.role_id
        }

        const token = jwt.sign(userForToken, process.env.SECRET as string);

        if (passwordCorrect) {
            res.json({
                msg: "",
                body: {
                    token,
                    email: user.email,
                    name: user.name,
                    role_id: user.role_id
                }
            })
        } else {
            res.json({
                msg: "Error en login"
            })
        }

        // const usuarios = await db.Usuario.findAll({
        //     where: {
        //         email: email,
        //         password_hash: passwordHash
        //     }
        // });

        // if (usuarios.length > 0) {
        //     res.json({
        //         msg: ""
        //     })
        // } else {
        //     res.json({
        //         msg: "Error en login"
        //     })
        // }
    });

    return [ path, router ];
}

export default LoginController;