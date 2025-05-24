import express, { Request, Response, Router, RequestHandler } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { UsuarioAttributes, UsuarioInstance } from '../types/models';

interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role_id: number;
}

interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
    role_id?: number;
}

interface QueryParams {
    id?: string;
    role_id?: string;
}

interface UserResponse {
    msg: string;
    id?: number;
    usuarios?: UsuarioInstance[];
    usuario?: UsuarioInstance;
    error?: string;
}

/**
 * Controlador de usuarios refactorizado
 * Siguiendo el principio de Responsabilidad Única (SRP),
 * este controlador solo se encarga de manejar las peticiones HTTP
 * y delegar la lógica de negocio al servicio correspondiente
 */
const UsuarioController = () => {
    const path: string = "/admin/users";
    const router: Router = express.Router();
    
    // Inicialización del servicio
    const usuarioService = new UsuarioService();

    // Endpoint para obtener user_id
    const getMeHandler: RequestHandler<{}, UserResponse> = async (req, res) => {
        const authorization = req.get("authorization");
        let token = '';
        
        if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
            token = authorization.substring(7);
        }

        try {
            const decodedToken = await usuarioService.verifyToken(token);
            res.json({
                msg: "",
                id: decodedToken.id
            });
        } catch (error) {
            res.status(401).json({ msg: "", error: 'token missing or invalid' });
        }
    };

    // Endpoint para obtener todos los usuarios
    const getAllUsersHandler: RequestHandler<{}, UserResponse> = async (req, resp) => {
        try {
            const usuarios = await usuarioService.getAllUsers();
            resp.json({
                msg: "",
                usuarios: usuarios
            });
        } catch (error) {
            resp.status(500).json({ msg: "", error: 'Error al obtener los usuarios' });
        }
    };

    // Endpoint para agregar un nuevo usuario
    const createUserHandler: RequestHandler<{}, UserResponse, CreateUserRequest> = async (req, resp) => {
        try {
            const nuevoUsuario: Partial<UsuarioAttributes> = {
                name: req.body.name,
                email: req.body.email,
                password_hash: req.body.password, // La contraseña será hasheada en el servicio
                role_id: req.body.role_id
            };

            const usuario = await usuarioService.createUser(nuevoUsuario);
            resp.status(201).json({
                msg: "Usuario creado exitosamente",
                usuario: usuario
            });
        } catch (error) {
            resp.status(500).json({ msg: "", error: 'Error al crear el usuario' });
        }
    };

    // Endpoint para eliminar un usuario
    const deleteUserHandler: RequestHandler<{}, UserResponse, {}, QueryParams> = async (req, resp) => {
        try {
            const id = Number(req.query.id);
            await usuarioService.deleteUser(id);
            resp.json({ msg: "Usuario eliminado exitosamente" });
        } catch (error) {
            resp.status(500).json({ msg: "", error: 'Error al eliminar el usuario' });
        }
    };

    // Endpoint para filtrar usuarios por rol
    const filterUsersHandler: RequestHandler<{}, UserResponse, {}, QueryParams> = async (req, resp) => {
        try {
            const roleId = Number(req.query.role_id);
            const usuarios = await usuarioService.getUsersByRole(roleId);
            resp.json({
                msg: "",
                usuarios: usuarios
            });
        } catch (error) {
            resp.status(500).json({ msg: "", error: 'Error al filtrar usuarios' });
        }
    };

    // Endpoint para obtener un usuario por su ID
    const getUserByIdHandler: RequestHandler<{ id: string }, UserResponse> = async (req, resp) => {
        try {
            const id = Number(req.params.id);
            const usuario = await usuarioService.getUserById(id);
            if (!usuario) {
                resp.status(404).json({ msg: "", error: 'Usuario no encontrado' });
                return;
            }
            resp.json({
                msg: "",
                usuario: usuario
            });
        } catch (error) {
            resp.status(500).json({ msg: "", error: 'Error al obtener el usuario' });
        }
    };

    // Endpoint para actualizar un usuario
    const updateUserHandler: RequestHandler<{ id: string }, UserResponse, UpdateUserRequest> = async (req, resp) => {
        try {
            const id = Number(req.params.id);
            const datosActualizados = req.body;
            await usuarioService.updateUser(id, datosActualizados);
            resp.json({ msg: "Usuario actualizado exitosamente" });
        } catch (error) {
            resp.status(500).json({ msg: "", error: 'Error al actualizar el usuario' });
        }
    };

    router.get('/me', getMeHandler);
    router.get('/', getAllUsersHandler);
    router.post("/", createUserHandler);
    router.delete("/", deleteUserHandler);
    router.get("/filter", filterUsersHandler);
    router.get("/:id", getUserByIdHandler);
    router.put("/:id", updateUserHandler);

    return [path, router];
};

export default UsuarioController;