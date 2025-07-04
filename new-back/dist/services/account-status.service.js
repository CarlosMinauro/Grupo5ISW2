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
    async getMonthlyStatus(month, year, userId, creditCardId) {
        try {
            if (month < 1 || month > 12) {
                throw new Error('Mes inválido');
            }
            if (!creditCardId) {
                throw new Error('El ID de la tarjeta es requerido');
            }
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            console.log('AccountStatusService: Attempting to fetch expenses between:', startDate, 'and', endDate);
            console.log('AccountStatusService: For user:', userId, 'and credit card:', creditCardId);
            const expenses = await models_1.Expense.findAll({
                where: {
                    user_id: userId,
                    credit_card_id: creditCardId,
                    date: {
                        [sequelize_1.Op.between]: [startDate, endDate]
                    }
                },
                include: [{
                        model: models_1.Category,
                        attributes: ['id', 'name']
                    }]
            });
            console.log('AccountStatusService: Expenses found:', expenses.length);
            const totalPaid = expenses
                .filter(expense => expense.transaction_type === 'payment')
                .reduce((sum, expense) => sum + Number(expense.amount), 0);
            const totalExpenses = expenses
                .filter(expense => expense.transaction_type === 'expense')
                .reduce((sum, expense) => sum + Number(expense.amount), 0);
            console.log('AccountStatusService: Processing expenses by category');
            const expensesByCategory = expenses.reduce((acc, expense) => {
                var _a, _b;
                const categoryId = ((_a = expense.Category) === null || _a === void 0 ? void 0 : _a.id) || 0;
                const categoryName = ((_b = expense.Category) === null || _b === void 0 ? void 0 : _b.name) || 'Uncategorized';
                const existingCategory = acc.find(cat => cat.categoryId === categoryId);
                if (existingCategory) {
                    existingCategory.amount += Number(expense.amount);
                }
                else {
                    acc.push({
                        categoryId,
                        categoryName,
                        amount: Number(expense.amount)
                    });
                }
                return acc;
            }, []);
            return {
                month,
                year,
                totalExpenses,
                balance: totalPaid - totalExpenses,
                expensesByCategory,
                totalPaid
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