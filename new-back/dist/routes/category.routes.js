"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const categoryController = new category_controller_1.CategoryController();
const categoryValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
];
router.use(auth_middleware_1.authenticateToken);
router.post('/', (0, auth_middleware_1.roleMiddleware)([1]), categoryValidation, categoryController.createCategory.bind(categoryController));
router.put('/:id', (0, auth_middleware_1.roleMiddleware)([1]), categoryValidation, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', (0, auth_middleware_1.roleMiddleware)([1]), categoryController.deleteCategory.bind(categoryController));
router.get('/', categoryController.getCategories.bind(categoryController));
router.get('/:id', categoryController.getCategory.bind(categoryController));
exports.default = router;
//# sourceMappingURL=category.routes.js.map