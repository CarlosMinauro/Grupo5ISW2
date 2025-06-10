"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRepository = void 0;
const base_repository_1 = require("./base.repository");
const budget_model_1 = __importDefault(require("../models/budget.model"));
class BudgetRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(budget_model_1.default);
    }
    async findByUserId(userId) {
        return this.findBy({ user_id: userId });
    }
    async findByCategoryId(categoryId) {
        return this.findBy({ category_id: categoryId });
    }
    async findByUserAndCategory(userId, categoryId) {
        return this.findOne({
            user_id: userId,
            category_id: categoryId,
        });
    }
    async getTotalBudgetByUser(userId) {
        const result = await this.model.sum('monthly_budget', {
            where: { user_id: userId },
        });
        return result || 0;
    }
}
exports.BudgetRepository = BudgetRepository;
//# sourceMappingURL=budget.repository.js.map