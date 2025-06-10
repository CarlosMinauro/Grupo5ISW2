"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const credit_card_controller_1 = require("../controllers/credit-card.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const creditCardController = new credit_card_controller_1.CreditCardController();
const cardValidation = [
    (0, express_validator_1.body)('card_number').notEmpty().withMessage('Card number is required'),
    (0, express_validator_1.body)('card_holder_name').notEmpty().withMessage('Card holder name is required'),
    (0, express_validator_1.body)('expiry_date').notEmpty().withMessage('Expiry date is required'),
];
router.use(auth_middleware_1.authenticateToken);
router.get('/', creditCardController.getCards.bind(creditCardController));
router.post('/', cardValidation, creditCardController.addCard.bind(creditCardController));
exports.default = router;
//# sourceMappingURL=credit-card.routes.js.map