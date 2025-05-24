import express, { Request, Response, Router, RequestHandler } from "express"
import bcrypt from "bcrypt"
import { Usuario, Role } from "../DAO/models"

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role_id: number;
}

interface EmailRequest {
    to: string;
    subject: string;
    html: string;
}

interface RegisterResponse {
    msg: string;
    usuario?: any;
    error?: string;
}

interface EmailResponse {
    error?: string;
    message?: string;
}

const RegisterController = () => {
    const path: string = "/register";
    const router: Router = express.Router();

    // Endpoint para registrar usuario
    const registerHandler: RequestHandler<{}, RegisterResponse, RegisterRequest> = async (req, res) => {
        try {
            const { name, email, password, role_id } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await Usuario.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({ msg: "", error: 'El usuario ya existe' });
                return;
            }

            // Verificar si el rol existe
            const role = await Role.findByPk(role_id);
            if (!role) {
                res.status(400).json({ msg: "", error: 'El rol especificado no existe' });
                return;
            }

            // Encriptar la contraseña
            const passwordHash = await bcrypt.hash(password, 10);

            // Crear el usuario
            const usuarioCreado = await Usuario.create({
                name,
                email,
                password_hash: passwordHash,
                role_id
            });

            res.status(201).json({
                msg: "Usuario creado exitosamente",
                usuario: usuarioCreado
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ msg: "", error: 'Error al crear el usuario' });
        }
    };

    // Endpoint para enviar email al registrarse
    const sendEmailHandler: RequestHandler<{}, EmailResponse, EmailRequest> = async (req, res) => {
        // Simulación: solo mostramos un mensaje de validación ficticia, no se envía ningún email real
        res.status(200).json({ message: 'Simulación: Se mostraría un mensaje de validación de correo aquí (no se envía email real).' });
    };

    router.post('/', registerHandler);
    router.post('/send-email', sendEmailHandler);

    return [ path, router ];
}

export default RegisterController;