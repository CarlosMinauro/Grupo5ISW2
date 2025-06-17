"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const expense_service_1 = require("../services/expense.service");
const express_validator_1 = require("express-validator");
class ExpenseController {
    constructor() {
        this.expenseService = expense_service_1.ExpenseService.getInstance();
    }
    static getInstance() {
        if (!ExpenseController.instance) {
            ExpenseController.instance = new ExpenseController();
        }
        return ExpenseController.instance;
    }
    async createExpense(req, res) {
        try {
            const userId = req.user.id;
            const expenseData = {
                ...req.body,
                user_id: userId,
            };
            const expense = await this.expenseService.createExpense(expenseData);
            res.status(201).json({
                message: 'Expense created successfully',
                expense,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error creating expense',
            });
        }
    }
    async getExpenses(req, res) {
        try {
            const userId = req.user.id;
            const creditCardId = req.query.credit_card_id ? Number(req.query.credit_card_id) : undefined;
            if (!creditCardId) {
                res.status(400).json({ message: 'El ID de la tarjeta es requerido' });
                return;
            }
            console.log('Obteniendo gastos para usuario:', userId, `y tarjeta ${creditCardId}`);
            console.log('Query params:', req.query);
            const expenses = await this.expenseService.getExpensesByUser(userId, creditCardId);
            console.log('Gastos encontrados:', expenses.length);
            console.log('Detalle de gastos:', JSON.stringify(expenses, null, 2));
            res.status(200).json({ expenses });
        }
        catch (error) {
            console.error('Error al obtener gastos:', error);
            res.status(500).json({
                message: error.message || 'Error fetching expenses',
            });
        }
    }
    async updateExpense(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const { id } = req.params;
            const expenseData = req.body;
            const expense = await this.expenseService.updateExpense(Number(id), expenseData);
            if (expense) {
                res.status(200).json({
                    message: 'Expense updated successfully',
                    expense,
                });
            }
            else {
                res.status(404).json({
                    message: 'Expense not found',
                });
            }
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error updating expense',
            });
        }
    }
    async deleteExpense(req, res) {
        try {
            const { id } = req.params;
            const success = await this.expenseService.deleteExpense(Number(id));
            if (success) {
                res.status(200).json({
                    message: 'Expense deleted successfully',
                });
            }
            else {
                res.status(404).json({
                    message: 'Expense not found',
                });
            }
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error deleting expense',
            });
        }
    }
    async getExpensesByDateRange(req, res) {
        try {
            const userId = req.user.id;
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate and endDate are required query parameters.' });
                return;
            }
            const expenses = await this.expenseService.getExpensesByDateRange(userId, new Date(startDate), new Date(endDate));
            res.status(200).json({ expenses });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Error fetching expenses by date range',
            });
        }
    }
    async getTotalExpensesByCategory(req, res) {
        try {
            const userId = req.user.id;
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate and endDate are required query parameters.' });
                return;
            }
            const totalExpenses = await this.expenseService.getTotalExpensesByCategory(userId, new Date(startDate), new Date(endDate));
            res.status(200).json({ totalExpenses });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Error fetching total expenses by category',
            });
        }
    }
}
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=expense.controller.js.map