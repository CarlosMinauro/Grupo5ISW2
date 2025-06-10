"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const user_model_1 = __importDefault(require("./user.model"));
const category_model_1 = __importDefault(require("./category.model"));
class Budget extends sequelize_1.Model {
}
Budget.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_model_1.default,
            key: 'id',
        },
    },
    monthly_budget: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: category_model_1.default,
            key: 'id',
        },
    },
}, {
    sequelize: database_1.default,
    tableName: 'Budgets',
    schema: 'public',
});
Budget.belongsTo(user_model_1.default, { foreignKey: 'user_id' });
Budget.belongsTo(category_model_1.default, { foreignKey: 'category_id' });
exports.default = Budget;
//# sourceMappingURL=budget.model.js.map