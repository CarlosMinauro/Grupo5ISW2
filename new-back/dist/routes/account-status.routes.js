"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_status_controller_1 = require("../controllers/account-status.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const accountStatusController = account_status_controller_1.AccountStatusController.getInstance();
router.get('/monthly', auth_middleware_1.authenticateToken, accountStatusController.getMonthlyStatus);
exports.default = router;
//# sourceMappingURL=account-status.routes.js.map