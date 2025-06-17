"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const expense_repository_1 = require("../repositories/expense.repository");
class ExpenseService {
    constructor() {
        this.expenseRepository = new expense_repository_1.ExpenseRepository();
    }
    static getInstance() {
        if (!ExpenseService.instance) {
            ExpenseService.instance = new ExpenseService();
        }
        return ExpenseService.instance;
    }
    async createExpense(expenseData) {
        console.log('Creando gasto con datos:', expenseData);
        if (!expenseData.credit_card_id) {
            throw new Error('El ID de la tarjeta es requerido');
        }
        return this.expenseRepository.create(expenseData);
    }
    async updateExpense(id, expenseData) {
        return this.expenseRepository.update(id, expenseData);
    }
    async deleteExpense(id) {
        return this.expenseRepository.delete(id);
    }
    async getExpensesByUser(userId, creditCardId) {
        console.log('ExpenseService: Obteniendo gastos para usuario:', userId, creditCardId ? `y tarjeta ${creditCardId}` : '');
        if (!creditCardId) {
            throw new Error('El ID de la tarjeta es requerido');
        }
        const expenses = await this.expenseRepository.findByUserId(userId, creditCardId);
        console.log('ExpenseService: Gastos encontrados:', expenses.length);
        return expenses;
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