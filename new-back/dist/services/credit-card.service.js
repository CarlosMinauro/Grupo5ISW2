"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardService = void 0;
const credit_card_model_1 = __importDefault(require("../models/credit-card.model"));
class CreditCardService {
    async getCardsByUser(userId) {
        return credit_card_model_1.default.findAll({ where: { user_id: userId } });
    }
    async createCard(cardData) {
        return credit_card_model_1.default.create(cardData);
    }
}
exports.CreditCardService = CreditCardService;
//# sourceMappingURL=credit-card.service.js.map