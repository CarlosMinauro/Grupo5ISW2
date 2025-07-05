import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateToken, roleMiddleware } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();
const categoryController = new CategoryController();

// Validation middleware
const categoryValidation = [
  body('name').notEmpty().withMessage('Name is required'),
];

// Routes
router.use(authenticateToken);

// Admin only routes
router.post('/', roleMiddleware([1]), categoryValidation, categoryController.createCategory.bind(categoryController));
router.put('/:id', roleMiddleware([1]), categoryValidation, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', roleMiddleware([1]), categoryController.deleteCategory.bind(categoryController));

// Public routes (for authenticated users)
router.get('/', categoryController.getCategories.bind(categoryController));
router.get('/:id', categoryController.getCategory.bind(categoryController));

export default router; 