"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_status_controller_1 = require("../controllers/account-status.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const accountStatusController = account_status_controller_1.AccountStatusController.getInstance();
const userController = new account_status_controller_1.UserController();
router.get('/monthly', auth_middleware_1.authenticateToken, accountStatusController.getMonthlyStatus);
router.get('/por-vencer', auth_middleware_1.authenticateToken, accountStatusController.getMontoPorVencer);
router.post('/users/additional', auth_middleware_1.authenticateToken, (req, res) => userController.registerAdditionalUser(req, res));
router.get('/users/additional', auth_middleware_1.authenticateToken, (req, res) => userController.getAdditionalUsers(req, res));
router.delete('/users/additional/:id', auth_middleware_1.authenticateToken, (req, res) => userController.deleteAdditionalUser(req, res));
exports.default = router;
//# sourceMappingURL=account-status.routes.js.map