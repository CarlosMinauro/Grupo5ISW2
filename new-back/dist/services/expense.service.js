"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const expense_repository_1 = require("../repositories/expense.repository");
class ExpenseService {
    constructor() {
        this.expenseRepository = new expense_repository_1.ExpenseRepository();
    }
    async createExpense(expenseData) {
        return this.expenseRepository.create(expenseData);
    }
    async updateExpense(id, expenseData) {
        return this.expenseRepository.update(id, expenseData);
    }
    async deleteExpense(id) {
        return this.expenseRepository.delete(id);
    }
    async getExpensesByUser(userId) {
        return this.expenseRepository.findByUserId(userId);
    }
    async getExpensesByCategory(categoryId) {
        return this.expenseRepository.findByCategoryId(categoryId);
    }
    async getExpensesByDateRange(userId, startDate, endDate) {
        return this.expenseRepository.findByDateRange(userId, startDate, endDate);
    }
    async getTotalExpensesByCategory(userId, startDate, endDate) {
        return this.expenseRepository.getTotalExpensesByCategory(userId, startDate, endDate);
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expense.service.js.map