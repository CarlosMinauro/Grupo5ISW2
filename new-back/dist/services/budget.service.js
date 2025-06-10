"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const budget_repository_1 = require("../repositories/budget.repository");
class BudgetService {
    constructor() {
        this.budgetRepository = new budget_repository_1.BudgetRepository();
    }
    async createBudget(budgetData) {
        return this.budgetRepository.create(budgetData);
    }
    async updateBudget(id, budgetData) {
        return this.budgetRepository.update(id, budgetData);
    }
    async deleteBudget(id) {
        return this.budgetRepository.delete(id);
    }
    async getBudgetsByUser(userId) {
        return this.budgetRepository.findByUserId(userId);
    }
    async getBudgetsByCategory(categoryId) {
        return this.budgetRepository.findByCategoryId(categoryId);
    }
    async getBudgetByUserAndCategory(userId, categoryId) {
        return this.budgetRepository.findByUserAndCategory(userId, categoryId);
    }
    async getTotalBudgetByUser(userId) {
        return this.budgetRepository.getTotalBudgetByUser(userId);
    }
}
exports.BudgetService = BudgetService;
//# sourceMappingURL=budget.service.js.map