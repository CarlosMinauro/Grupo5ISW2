"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const budget_service_1 = require("../services/budget.service");
const express_validator_1 = require("express-validator");
class BudgetController {
    constructor() {
        this.budgetService = new budget_service_1.BudgetService();
    }
    async createBudget(req, res) {
        try {
            const userId = req.user.id;
            const budgetData = {
                ...req.body,
                user_id: userId,
            };
            const budget = await this.budgetService.createBudget(budgetData);
            res.status(201).json({
                message: 'Budget created successfully',
                budget,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error creating budget',
            });
        }
    }
    async updateBudget(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const { id } = req.params;
            const budget = await this.budgetService.updateBudget(Number(id), req.body);
            if (!budget) {
                res.status(404).json({ message: 'Budget not found' });
                return;
            }
            res.status(200).json({
                message: 'Budget updated successfully',
                budget,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error updating budget',
            });
        }
    }
    async deleteBudget(req, res) {
        try {
            const { id } = req.params;
            const success = await this.budgetService.deleteBudget(Number(id));
            if (!success) {
                res.status(404).json({ message: 'Budget not found' });
                return;
            }
            res.status(200).json({ message: 'Budget deleted successfully' });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error deleting budget',
            });
        }
    }
    async getBudgets(req, res) {
        try {
            const userId = req.user.id;
            const budgets = await this.budgetService.getBudgetsByUser(userId);
            res.status(200).json({ budgets });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error fetching budgets',
            });
        }
    }
    async getBudgetByCategory(req, res) {
        try {
            const userId = req.user.id;
            const { categoryId } = req.params;
            const budget = await this.budgetService.getBudgetByUserAndCategory(userId, Number(categoryId));
            if (!budget) {
                res.status(404).json({ message: 'Budget not found' });
                return;
            }
            res.status(200).json({ budget });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error fetching budget',
            });
        }
    }
    async getTotalBudget(req, res) {
        try {
            const userId = req.user.id;
            const total = await this.budgetService.getTotalBudgetByUser(userId);
            res.status(200).json({ total });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error fetching total budget',
            });
        }
    }
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=budget.controller.js.map