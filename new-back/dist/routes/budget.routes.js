"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budget_controller_1 = require("../controllers/budget.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const budgetController = new budget_controller_1.BudgetController();
const budgetValidation = [
    (0, express_validator_1.body)('monthly_budget').isNumeric().withMessage('Monthly budget must be a number'),
    (0, express_validator_1.body)('category_id').isInt().withMessage('Valid category ID is required'),
];
router.use(auth_middleware_1.authenticateToken);
router.post('/', budgetValidation, budgetController.createBudget.bind(budgetController));
router.put('/:id', budgetValidation, budgetController.updateBudget.bind(budgetController));
router.delete('/:id', budgetController.deleteBudget.bind(budgetController));
router.get('/', budgetController.getBudgets.bind(budgetController));
router.get('/category/:categoryId', budgetController.getBudgetByCategory.bind(budgetController));
router.get('/total', budgetController.getTotalBudget.bind(budgetController));
exports.default = router;
//# sourceMappingURL=budget.routes.js.map