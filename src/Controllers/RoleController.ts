import express, { Request, Response } from "express"
const db = require("../DAO/models")

const RoleController = () => {
    const path = "/admin/roles"

    const router = express.Router()

    // Endpoint para obtener todos los roles
    router.get("/", async (req : Request, resp : Response) => {
        const roles = await db.Role.findAll()
        resp.json({
            msg : "",
            roles : roles
        }) 
    })

    return [ path, router ]
}

export default RoleController