import express, {Request, Response} from "express"
import { Usuario, PasswordResets } from "../DAO/models"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const ResetPasswordController = () => {
    const path: string = "/reset-password";
    
    const router = express.Router();

    // Endpoint para cambiar la constraseña
    router.post('/', async (req: Request, res: Response) => {
        const { email, password, rw_password } = req.body;

        const newPasswordCorrect = password === rw_password ? true : false
        const userExists = await Usuario.findOne({ where: { email } });
        
        if ((newPasswordCorrect && userExists)) {
            res.json({
                msg: ""
            })

            const newPasswordHash = await bcrypt.hash(password, 10);
            await Usuario.update(
                { password_hash: newPasswordHash }, // Valores a actualizar
                { where: { email } } // Condición para encontrar al usuario
            );

            const tokenIncludes = {
                id: userExists.id,
                password: userExists.password_hash
            }

            const token = jwt.sign(tokenIncludes, process.env.SECRET as string);

            // Insertar una nueva fila en la tabla PasswordResets
            await PasswordResets.create({
                usuarioId: userExists.id, // Clave foránea
                token: token,
                created_at: new Date() // Establecer la fecha actual
            });

        } else {
            res.json({
                msg: "Contraseñas o usuario incorrectos"
            })
        }
    });

    return [path, router]
}

export default ResetPasswordController