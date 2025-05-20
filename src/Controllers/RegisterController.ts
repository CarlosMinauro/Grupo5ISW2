import express, {Request, Response} from "express"
const db = require("../DAO/models")
const bcrypt = require("bcrypt")

const RegisterController = () => {
    const path: string = "/register";

    const router = express.Router();

    // Endpoint para registrar usuario
    router.post('/', async (req: Request, res: Response) => {
        const nuevoUsuario = req.body;

        const passwordHash = await bcrypt.hash(nuevoUsuario.password, 10);

        const email_val: string = nuevoUsuario.email;

        const usuarioCreado = await db.Usuario.create({
            id: null,
            name: nuevoUsuario.name,
            email: nuevoUsuario.email,
            password_hash: passwordHash,
            role_id: email_val.toLowerCase().startsWith("adm") ? 1 : 2
        });

        res.json({
            msg: "",
            usuario: usuarioCreado
        })
    });

    // Endpoint para enviar email al registrarse
    router.post('/send-email', async (req: Request, res: Response) => {
        try {
            const { to, subject, html } = req.body;

            if (!to || !subject || !html) {
                res.status(400).json({error: 'Missing required fields'});
                return;
            }

            // Send email via Resend API
        const response = await fetch(process.env.RESEND_API_URL as string, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to,
                subject,
                html,
            }),
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send email');
        }

        // Parse the response data
        const data = await response.json();

        // Return the response from Resend API
        res.status(200).json(data);
            
        } catch (error) {
            console.error('Error sending email:', error);
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: 'Unknown error'});
            }
        }
    })

    return [ path, router ];
}

export default RegisterController;