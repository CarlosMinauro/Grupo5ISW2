import express, { Request, Response } from "express"
import { Categories } from "../DAO/models"

const CategoriaController = () => {
    const path = "/categorias"

    const router = express.Router()

    router.get("/", async (req : Request, resp : Response) => {
        const categorias = await Categories.findAll()
        resp.json({
            msg : "",
            categorias : categorias
        }) 
    })

    return [ path, router ]
}

export default CategoriaController