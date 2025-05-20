import express, {Request, Response} from "express"
const db = require("../DAO/models")
const jwt = require("jsonwebtoken")

const AccessLogsController = () => {
    const path: string = "/accesslogs";
    
    const router = express.Router();

    router.post('/', async (req: Request, res: Response) => {
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

        const existingLog = await db.Access_logs.findOne({
            where: { user_id: decodedToken.id }
        });

        const nuevoAccessLog= req.body;

        const accessLogCreado = await db.Access_logs.create({
            id: null,
            user_id: decodedToken.id,
            // access_time: new Date(),
            action: nuevoAccessLog.action,
            firstaccess: existingLog ? false : true
        });

        res.json({
            msg: "",
            al: accessLogCreado
        })
    });

    router.get("/", async (req: Request, res: Response) => {
        try {
            // console.log("Fetching access logs...");
            const accessLogs = await db.Access_logs.findAll({
                attributes: ["id", "access_time", "action"],
                include: [{
                    model: db.Usuario,  
                    as: "usuario", 
                    attributes: ["name", "email"]
                }],
                order: [["access_time", "DESC"]],
            });

            console.log("Fetched logs:", accessLogs);
            res.status(200).json(accessLogs);
        } catch (error) {
            console.error("Error fetching access logs:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    return [ path, router ];
}

export default AccessLogsController;