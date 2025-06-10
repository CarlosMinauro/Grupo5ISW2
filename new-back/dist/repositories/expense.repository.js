"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const base_repository_1 = require("./base.repository");
const expense_model_1 = __importDefault(require("../models/expense.model"));
const sequelize_1 = require("sequelize");
class ExpenseRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(expense_model_1.default);
    }
    async findByUserId(userId) {
        return this.findBy({ user_id: userId });
    }
    async findByCategoryId(categoryId) {
        return this.findBy({ category_id: categoryId });
    }
    async findByDateRange(userId, startDate, endDate) {
        return this.model.findAll({
            where: {
                user_id: userId,
                date: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            include: ['Category'],
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
            include: ['Category'],
        });
    }
}
exports.ExpenseRepository = ExpenseRepository;
//# sourceMappingURL=expense.repository.js.map