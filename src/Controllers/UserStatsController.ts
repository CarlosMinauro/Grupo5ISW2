import express, { Request, Response } from "express";
const db = require("../DAO/models"); // Asegurarse de que la importación es correcta
import { Op, Sequelize } from "sequelize";

const router = express.Router();

const UserStatsController = () => {

    const path = '/user-statistics';
    
    router.get(('/'), async (req:Request, res: Response) => {
    
        try {
            const Usuario = db.Usuario; // Asegurar que el modelo se está obteniendo correctamente
    
            const totalUsers = await Usuario.count();
            
            // AQUI SE DEBERIA AGREGAR LA MODIFICACION PARA QUE FUNCIONE 
            const year = new Date().getFullYear();
    
            // 2. Obtener el conteo de registros en Access_logs donde firstaccess = true
            //    agrupados por mes (del presente año).
            const rows = await db.Access_logs.findAll({
                attributes: [
                  // Usamos EXTRACT(MONTH FROM "access_time") y lo nombramos como 'month'
                  [Sequelize.literal('EXTRACT(MONTH FROM "access_time")'), 'month'],
                  // Para el conteo, igual que antes
                  [Sequelize.fn('COUNT', '*'), 'count']
                ],
                where: {
                  firstaccess: true,
                  access_time: {
                    [Op.gte]: new Date(year, 0, 1),   // 1 de enero del año actual
                    [Op.lt]: new Date(year + 1, 0, 1) // 1 de enero del siguiente año
                  },
                },
                // Agrupamos y ordenamos usando exactamente la misma expresión del literal
                group: [Sequelize.literal('EXTRACT(MONTH FROM "access_time")')],
                order: [[Sequelize.literal('EXTRACT(MONTH FROM "access_time")'), 'ASC']],
                raw: true
              });
              
        
            // 3. Crear un array de 12 posiciones (para cada mes del año) y rellenarlo con 0
            const newUsersByMonth = Array(12).fill(0);
        
            // 4. Para cada fila devuelta, ajustar el índice (mes-1)
            //    y asignar el conteo parseado a entero.
            rows.forEach((row: { month: number; count: string }) => {
              const monthIndex = row.month - 1;
              newUsersByMonth[monthIndex] = parseInt(row.count, 10);
            });
            // AQUI SE DEBERIA AGREGAR LA MODIFICACION PARA QUE FUNCIONE 
    
            //res.status(200).json({ totalUsers, newUsersByMonth });
            res.status(200).json({ totalUsers, newUsersByMonth});
        } catch (error) {
            console.error("Error getting user statistics:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }) 

    return [path, router];
}


export default UserStatsController;