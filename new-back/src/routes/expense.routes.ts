import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();
const expenseController = new ExpenseController();

// Validation middleware
const expenseValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('category_id').isInt().withMessage('Valid category ID is required'),
  body('recurring').isBoolean().withMessage('Recurring must be a boolean'),
];

// Routes
router.use(authenticateToken);

router.post('/', expenseValidation, expenseController.createExpense.bind(expenseController));
router.put('/:id', expenseValidation, expenseController.updateExpense.bind(expenseController));
router.delete('/:id', expenseController.deleteExpense.bind(expenseController));
router.get('/', expenseController.getExpenses.bind(expenseController));
router.get('/date-range', expenseController.getExpensesByDateRange.bind(expenseController));
router.get('/totals-by-category', expenseController.getTotalExpensesByCategory.bind(expenseController));

export default router; 