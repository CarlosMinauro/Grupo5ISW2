"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const expense_service_1 = require("../services/expense.service");
const express_validator_1 = require("express-validator");
class ExpenseController {
    constructor() {
        this.expenseService = new expense_service_1.ExpenseService();
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
    async updateExpense(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const { id } = req.params;
            const expense = await this.expenseService.updateExpense(Number(id), req.body);
            if (!expense) {
                res.status(404).json({ message: 'Expense not found' });
                return;
            }
            res.status(200).json({
                message: 'Expense updated successfully',
                expense,
            });
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
            if (!success) {
                res.status(404).json({ message: 'Expense not found' });
                return;
            }
            res.status(200).json({ message: 'Expense deleted successfully' });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error deleting expense',
            });
        }
    }
    async getExpenses(req, res) {
        try {
            const userId = req.user.id;
            const expenses = await this.expenseService.getExpensesByUser(userId);
            res.status(200).json({ expenses });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Error fetching expenses',
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