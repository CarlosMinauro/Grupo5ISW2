"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const user_model_1 = __importDefault(require("./user.model"));
class CreditCard extends sequelize_1.Model {
}
CreditCard.init({
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
    card_number: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    card_holder_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    expiration_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    brand: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    bank: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    cut_off_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    payment_due_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'CreditCards',
    schema: 'public',
});
exports.default = CreditCard;
//# sourceMappingURL=credit-card.model.js.map