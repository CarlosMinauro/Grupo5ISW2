import express, { Request, Response, Router, RequestHandler } from "express";
import { Usuario } from "../DAO/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    msg: string;
    error?: string;
    body?: {
        token: string;
        email: string;
        name: string;
        role_id: number;
    };
}

const LoginController = () => {
    const path: string = "/login";
    const router: Router = express.Router();

    // Endpoint para verificar usuario
    const loginHandler: RequestHandler<{}, LoginResponse, LoginRequest> = async (req, res) => {
        try {
            const { email, password } = req.body;

            console.log('Received login attempt for email:', email);

            console.log('Querying database for email:', email);
            const user = await Usuario.findOne({
                where: { email: email }
            });

            if (!user) {
                res.status(401).json({
                    msg: "Error en login",
                    error: "Usuario no encontrado"
                });
                return;
            }

            const passwordCorrect = await bcrypt.compare(password, user.password_hash);

            if (!passwordCorrect) {
                res.status(401).json({
                    msg: "Error en login",
                    error: "Contraseña incorrecta"
                });
                return;
            }

            const userForToken = {
                id: user.id,
                email: user.email,
                role_id: user.role_id
            };

            const token = jwt.sign(userForToken, process.env.SECRET as string);

            res.json({
                token,
                email: user.email,
                name: user.name,
                role_id: user.role_id
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                msg: "Error en login",
                error: "Error interno del servidor"
            });
        }
    };

    router.post('/', loginHandler);

    return [path, router];
};

export default LoginController;