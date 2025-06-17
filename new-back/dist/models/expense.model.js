"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const user_model_1 = __importDefault(require("./user.model"));
const category_model_1 = __importDefault(require("./category.model"));
const credit_card_model_1 = __importDefault(require("./credit-card.model"));
class Expense extends sequelize_1.Model {
}
Expense.init({
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
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    recurring: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: category_model_1.default,
            key: 'id',
        },
    },
    credit_card_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: credit_card_model_1.default,
            key: 'id',
        },
    },
    transaction_type: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'expense',
        validate: {
            isIn: [['expense', 'payment']],
        },
    },
}, {
    sequelize: database_1.default,
    tableName: 'Expenses',
    schema: 'public',
});
Expense.belongsTo(user_model_1.default, { foreignKey: 'user_id' });
Expense.belongsTo(category_model_1.default, { foreignKey: 'category_id' });
Expense.belongsTo(credit_card_model_1.default, { foreignKey: 'credit_card_id' });
exports.default = Expense;
//# sourceMappingURL=expense.model.js.map