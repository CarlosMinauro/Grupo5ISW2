"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatusService = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
class AccountStatusService {
    constructor() { }
    static getInstance() {
        if (!AccountStatusService.instance) {
            AccountStatusService.instance = new AccountStatusService();
        }
        return AccountStatusService.instance;
    }
    async getMonthlyStatus(month, year, userId) {
        try {
            if (month < 1 || month > 12) {
                throw new Error('Mes inválido');
            }
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            console.log('Buscando gastos entre:', startDate, 'y', endDate);
            const expenses = await models_1.Expense.findAll({
                where: {
                    user_id: userId,
                    date: {
                        [sequelize_1.Op.between]: [startDate, endDate]
                    }
                },
                include: [{
                        model: models_1.Category,
                        attributes: ['id', 'name']
                    }]
            });
            console.log('Gastos encontrados:', expenses.length);
            const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
            console.log('Fetching all budgets for user:', userId);
            const budgets = await models_1.Budget.findAll({
                where: {
                    user_id: userId,
                },
            });
            console.log('Presupuestos encontrados:', budgets.length);
            console.log('Presupuestos data:', JSON.stringify(budgets));
            const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.monthly_budget), 0);
            console.log('Total presupuesto calculado:', totalBudget);
            const totalIncome = totalBudget;
            const expensesByCategory = expenses.reduce((acc, expense) => {
                const categoryId = expense.Category.id;
                const existingCategory = acc.find(cat => cat.categoryId === categoryId);
                if (existingCategory) {
                    existingCategory.amount += Number(expense.amount);
                }
                else {
                    acc.push({
                        categoryId,
                        categoryName: expense.Category.name,
                        amount: Number(expense.amount)
                    });
                }
                return acc;
            }, []);
            return {
                month,
                year,
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                expensesByCategory
            };
        }
        catch (error) {
            console.error('Error en getMonthlyStatus:', error);
            throw error;
        }
    }
}
exports.AccountStatusService = AccountStatusService;
//# sourceMappingURL=account-status.service.js.map