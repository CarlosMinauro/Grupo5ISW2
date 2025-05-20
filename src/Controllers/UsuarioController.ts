import express, {Request, Response} from "express"
const db = require("../DAO/models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UsuarioController = () => {
    const path: string = "/admin/users";

    const router = express.Router()

    // Endpoint para obtener user_id
    router.get('/me', async (req: Request, res: Response) => {
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
        if (!token || !decodedToken.id) {
            res.status(401).json({error: 'token missing or invalid'});
            return;
        }
        res.json({
            msg: "",
            id: decodedToken.id
        })
    })


    // Endpoint para obtener todos los usuarios
    router.get('/', async (req: Request, resp: Response) => {
        const usuarios = await db.Usuario.findAll({
            include : {
                model : db.Role,
                as : "Role",
                attributes : ["name"],
                required : true
            },
            order: [["id", "ASC"]] // Ordena por ID ascendente
        })

        resp.json({
            msg : "",
            usuarios : usuarios
        })
    })

    // Endpoint para agregar un nuevo usuario
    router.post("/", async (req : Request, resp : Response) => {
        const nuevoUsuario = req.body
        const passwordHash = await bcrypt.hash(nuevoUsuario.password_hash, 10)

        const usuarioCreado = await db.Usuario.create({
            id : null,
            name : nuevoUsuario.name,
            email : nuevoUsuario.email,
            password_hash : passwordHash,
            role_id : nuevoUsuario.role_id
        })

        resp.json({
            msg : "",
            usuario : usuarioCreado
        })
    })

    // Endpoint para eliminar un usuario
    router.delete("/", async (req : Request, resp : Response) => {
        const id = req.query.id

        await db.Usuario.destroy({
            where : {
                id : id
            }
        })

        resp.json({
            msg : ""
        })
    })

    // Endpoint para filtrar usuarios por nombre
    router.get("/filter", async (req: Request, resp: Response) => {
        
        const id = req.query.role_id
        const usuarios = await db.Usuario.findAll({
            where : {
                role_id : id
            },
            include : {
                model : db.Role,
                as : "Role",
                attributes : ["name"],
                required : true
            },
            order: [["id", "ASC"]] // Ordena por ID ascendente
        })

        resp.json({
            msg : "",
            usuarios : usuarios
        })
    })

    // Endpoint para obtener un usuario por su ID
    router.get("/:id", async (req : Request, resp : Response) => {
        const id = req.params.id
        const usuario = await db.Usuario.findByPk(id, {
            include : {
                model : db.Role,
                as : "Role",
                attributes : ["name"],
                required : true
            }
        })

        resp.json({
            msg : "",
            usuario : usuario
        })
    })


    // Endpoint para actualizar un usuario
    router.put("/:id", async (req: Request, resp: Response) => {
        const id = req.params.id
        const datosActualizados = req.body
        console.log(datosActualizados.name)
        // 
        let passwordHash: string | undefined;
        
        // Si se proporciona una nueva contraseña, la encripta y la agrega a la actualización
        if (datosActualizados.password_hash) {
            passwordHash = await bcrypt.hash(datosActualizados.password_hash, 10);
        }

        // 
        const usuarioActualizado: any = {
            name: datosActualizados.name,
            email: datosActualizados.email,
            role_id: datosActualizados.role_id,
        };

        // Si la contraseña se encriptó, la agregamos a la actualización
        if (passwordHash) {
            usuarioActualizado.password_hash = passwordHash;
        }

        // Actualizar usuario
        await db.Usuario.update(usuarioActualizado, { where: { id: id } });
        resp.json({ msg: "" })
    })

    return [ path, router ]
}

export default UsuarioController;