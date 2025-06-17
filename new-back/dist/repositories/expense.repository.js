"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const base_repository_1 = require("./base.repository");
const expense_model_1 = __importDefault(require("../models/expense.model"));
const sequelize_1 = require("sequelize");
const category_model_1 = __importDefault(require("../models/category.model"));
const credit_card_model_1 = __importDefault(require("../models/credit-card.model"));
class ExpenseRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(expense_model_1.default);
    }
    async findByUserId(userId, creditCardId) {
        console.log('Buscando gastos para usuario:', userId, creditCardId ? `y tarjeta ${creditCardId}` : '');
        if (!creditCardId) {
            throw new Error('El ID de la tarjeta es requerido');
        }
        const where = {
            user_id: userId,
            credit_card_id: creditCardId
        };
        console.log('Condiciones de búsqueda:', where);
        const expenses = await this.model.findAll({
            where,
            include: [
                {
                    model: category_model_1.default,
                    attributes: ['id', 'name']
                },
                {
                    model: credit_card_model_1.default,
                    attributes: ['id', 'card_number', 'brand']
                }
            ],
            order: [['date', 'DESC']]
        });
        console.log('Gastos encontrados:', expenses.length);
        console.log('Detalle de gastos:', JSON.stringify(expenses, null, 2));
        return expenses;
    }
    async findByCategoryId(categoryId) {
        return this.model.findAll({
            where: { category_id: categoryId },
            include: [
                {
                    model: category_model_1.default,
                    attributes: ['id', 'name']
                },
                {
                    model: credit_card_model_1.default,
                    attributes: ['id', 'card_number', 'brand']
                }
            ]
        });
    }
    async findByDateRange(userId, startDate, endDate) {
        return this.model.findAll({
            where: {
                user_id: userId,
                date: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    model: category_model_1.default,
                    attributes: ['id', 'name']
                },
                {
                    model: credit_card_model_1.default,
                    attributes: ['id', 'card_number', 'brand']
                }
            ]
        });
    }
    async getTotalExpensesByCategory(userId, startDate, endDate) {
        return this.model.findAll({
            attributes: [
                'category_id',
                [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('amount')), 'total'],
            ],
            where: {
                user_id: userId,
                date: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            group: ['category_id'],
            include: [
                {
                    model: category_model_1.default,
                    attributes: ['id', 'name']
                }
            ]
        });
    }
}
exports.ExpenseRepository = ExpenseRepository;
//# sourceMappingURL=expense.repository.js.map