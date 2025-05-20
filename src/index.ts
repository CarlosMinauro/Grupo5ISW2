import express, {Express, Request, Response, Router} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import RegisterController from "./Controllers/RegisterController";
import LoginController from "./Controllers/LoginController";
import UsuarioController from "./Controllers/UsuarioController";
import AddGastoController from "./Controllers/AddGastoController";
import BudgetsController from "./Controllers/BudgetsController";
import AddPresupuestoController from "./Controllers/AddPresupuestoController";
import RoleController from "./Controllers/RoleController";
import ExpensesController from "./Controllers/ExpensesControllers";
import ReportsController from "./Controllers/ReportsController";
import CategoriaController from "./Controllers/CategoriaController";
import ResetPasswordController from "./Controllers/ResetPasswordController";
import EditExpensesController from "./Controllers/EditExpensesController";
import AccessLogsController from "./Controllers/AccessLogsController";
import AlertaPresupuestoController from "./Controllers/AlertaPresupuestoController";
import PerfilController from "./Controllers/PerfilController";
import UserStatsController from "./Controllers/UserStatsController";

dotenv.config()

const app : Express = express()

// Remove duplicate CORS configurations and set up a single one
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both localhost and 127.0.0.1
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.static("assets")) // Carpeta archivos estaticos

const port = process.env.PORT || 5000;

const [ registerPath, registerRouter ] = RegisterController();
const [ loginPath, loginRouter ] = LoginController();
const [ userPath, userRouter ] = UsuarioController();
const [ rolePath, roleRouter ] = RoleController();
const [ addGastoPath, addGastoRouter ] = AddGastoController();
const [ BudgetsPath, BudgetsRouter ] = BudgetsController();
const [expensesPath, expensesRouter] = ExpensesController();
const [reportsPath, reportsRouter] = ReportsController();
const [catPath, catRouter] = CategoriaController();
const [ addPresupuestoPath, addPresupuestoRouter ] = AddPresupuestoController();
const [ resetPasswordPath, resetPasswordRouter ] = ResetPasswordController();
const [ editExpensesPath, editExpensesRouter ] = EditExpensesController()
const [ accessLogPath, accessLogRouter ] = AccessLogsController();
const [ alertaPresupuestoPath, alertaPresupuestoRouter ] = AlertaPresupuestoController();
const [ perfilPath, perfilRouter ] = PerfilController();
const [ userStatsPath, userStatsRouter ] = UserStatsController();

app.use(registerPath as string, registerRouter as Router);
app.use(loginPath as string, loginRouter as Router);
app.use(userPath as string, userRouter as Router);
app.use(rolePath as string, roleRouter as Router);
app.use(addGastoPath as string, addGastoRouter as Router);
app.use(BudgetsPath as string, BudgetsRouter as Router);
app.use(expensesPath as string, expensesRouter as Router);
app.use(reportsPath as string, reportsRouter as Router);
app.use(catPath as string, catRouter as Router);
app.use(addPresupuestoPath as string, addPresupuestoRouter as Router);
app.use(resetPasswordPath as string, resetPasswordRouter as Router);
app.use(editExpensesPath as string, editExpensesRouter as Router)
app.use(alertaPresupuestoPath as string, alertaPresupuestoRouter as Router)
app.use(perfilPath as string, perfilRouter as Router)
app.use(accessLogPath as string, accessLogRouter as Router);
app.use(userStatsPath as string, userStatsRouter as Router);

app.listen(port, () => {
    console.log(`[Server]: Servidor ejecutandose en puerto ${port}`)
})