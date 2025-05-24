import { Sequelize, ModelStatic } from 'sequelize';
import { UsuarioInstance, RoleInstance, Access_logsInstance, ModelStatic as ModelStaticType } from '../../types/models';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'database',
    process.env.DB_USER || 'user',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
        port: parseInt(process.env.DB_PORT || '5432'),
    }
);

// Importar los modelos
const UsuarioModel = require('./usuario').default;
const RoleModel = require('./role').default;
const Access_logsModel = require('./access_logs').default;
const CategoriesModel = require('./categories').default;
const ExpensesModel = require('./expenses').default;
const BudgetsModel = require('./budgets').default;
const PasswordResetsModel = require('./passwordresets').default;

// Inicializar los modelos
const UsuarioModelInstance = UsuarioModel(sequelize) as ModelStaticType<UsuarioInstance>;
const RoleModelInstance = RoleModel(sequelize) as ModelStaticType<RoleInstance>;
const Access_logsModelInstance = Access_logsModel(sequelize) as ModelStaticType<Access_logsInstance>;
const CategoriesModelInstance = CategoriesModel(sequelize);
const ExpensesModelInstance = ExpensesModel(sequelize);
const BudgetsModelInstance = BudgetsModel(sequelize);
const PasswordResetsModelInstance = PasswordResetsModel(sequelize);

// Definir las asociaciones
UsuarioModelInstance.belongsTo(RoleModelInstance, { foreignKey: 'role_id', as: 'Role' });
Access_logsModelInstance.belongsTo(UsuarioModelInstance, { foreignKey: 'user_id', as: 'usuario' });
UsuarioModelInstance.hasMany(Access_logsModelInstance, { foreignKey: 'user_id', as: 'AccessLogs' });

// Exportar las instancias con nombres que coincidan con los usados en los controladores
export {
    sequelize,
    UsuarioModelInstance as Usuario,
    RoleModelInstance as Role,
    Access_logsModelInstance as Access_logs,
    CategoriesModelInstance as Categories,
    ExpensesModelInstance as Expenses,
    BudgetsModelInstance as Budgets,
    PasswordResetsModelInstance as PasswordResets
}; 