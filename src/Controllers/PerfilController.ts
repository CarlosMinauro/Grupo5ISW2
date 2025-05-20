// src/Controllers/PerfilController.ts

import express, { Request, Response } from "express";
const db = require("../DAO/models"); // Ajusta la ruta según tu estructura
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const PerfilController = () => {
  const path = "/perfil"; // Usaremos /perfil en lugar de /me
  const router = express.Router();

  // GET /perfil - Obtener datos del usuario logueado
  router.get("/", async (req: Request, res: Response):Promise<any> => {
    try {
      const authorization = req.get("authorization") || "";
      let token = "";
      if (authorization.toLowerCase().startsWith("bearer ")) {
        token = authorization.substring(7);
      }
      const decoded: any = jwt.verify(token, process.env.SECRET as string);
      if (!decoded.id) {
        return res.status(401).json({ error: "token missing or invalid" });
      }

      // Buscar usuario en la BD
      const user = await db.Usuario.findOne({
        where: { id: decoded.id },
        // Solo columnas que quieras devolver
        attributes: ["id", "name", "email"]
      });
      if (!user) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      return res.json({ msg: "", user });
    } catch (error) {
      console.error("GET /perfil Error:", error);
      return res.status(500).json({ msg: "Error al obtener datos del usuario" });
    }
  });

  // PUT /perfil - Actualizar datos del usuario logueado
  router.put("/", async (req: Request, res: Response):Promise<any> => {
    try {
      const authorization = req.get("authorization") || "";
      let token = "";
      if (authorization.toLowerCase().startsWith("bearer ")) {
        token = authorization.substring(7);
      }
      const decoded: any = jwt.verify(token, process.env.SECRET as string);
      if (!decoded.id) {
        return res.status(401).json({ error: "token missing or invalid" });
      }

      const { name, email, password } = req.body;
      const user = await db.Usuario.findOne({ where: { id: decoded.id } });
      if (!user) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      // Actualizar campos si existen
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        user.password_hash = passwordHash;
      }
      await user.save();

      return res.json({
        msg: "",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("PUT /perfil Error:", error);
      return res.status(500).json({ msg: "Error al actualizar datos del usuario" });
    }
  });

  return [path, router];
};

export default PerfilController;
