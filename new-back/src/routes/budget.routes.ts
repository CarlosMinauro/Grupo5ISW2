import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();
const budgetController = new BudgetController();

// Validation middleware
const budgetValidation = [
  body('monthly_budget').isNumeric().withMessage('Monthly budget must be a number'),
  body('category_id').isInt().withMessage('Valid category ID is required'),
];

// Routes
router.use(authenticateToken);

router.post('/', budgetValidation, budgetController.createBudget.bind(budgetController));
router.put('/:id', budgetValidation, budgetController.updateBudget.bind(budgetController));
router.delete('/:id', budgetController.deleteBudget.bind(budgetController));
router.get('/', budgetController.getBudgets.bind(budgetController));
router.get('/category/:categoryId', budgetController.getBudgetByCategory.bind(budgetController));
router.get('/total', budgetController.getTotalBudget.bind(budgetController));

export default router; 