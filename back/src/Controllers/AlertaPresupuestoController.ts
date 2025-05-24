import express, {Request, Response} from "express"
const db = require("../DAO/models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const AlertaPresupuestoController = () => {
    const path: string = "/alerta-presupuesto"
    const router = express.Router();



    return [ path, router ]
}


export default AlertaPresupuestoController