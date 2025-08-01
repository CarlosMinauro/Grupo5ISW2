"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_1 = require("../controllers/expense.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const expenseController = expense_controller_1.ExpenseController.getInstance();
const expenseValidation = [
    (0, express_validator_1.body)('amount').isNumeric().withMessage('Amount must be a number'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('category_id')
        .optional()
        .custom((value) => value === null || (typeof value === 'number' && Number.isInteger(value)))
        .withMessage('Valid category ID is required or null'),
    (0, express_validator_1.body)('recurring').isBoolean().withMessage('Recurring must be a boolean'),
    (0, express_validator_1.body)('credit_card_id')
        .optional()
        .custom((value) => value === null || (typeof value === 'number' && Number.isInteger(value)))
        .withMessage('Valid credit card ID is required or null'),
    (0, express_validator_1.body)('transaction_type').isIn(['expense', 'payment']).withMessage('Invalid transaction type'),
];
router.use(auth_middleware_1.authenticateToken);
router.post('/', expenseValidation, expenseController.createExpense.bind(expenseController));
router.put('/:id', expenseValidation, expenseController.updateExpense.bind(expenseController));
router.delete('/:id', expenseController.deleteExpense.bind(expenseController));
router.get('/', expenseController.getExpenses.bind(expenseController));
router.get('/date-range', expenseController.getExpensesByDateRange.bind(expenseController));
router.get('/totals-by-category', expenseController.getTotalExpensesByCategory.bind(expenseController));
exports.default = router;
//# sourceMappingURL=expense.routes.js.map