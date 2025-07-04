"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardService = void 0;
const credit_card_model_1 = __importDefault(require("../models/credit-card.model"));
const expense_model_1 = __importDefault(require("../models/expense.model"));
class CreditCardService {
    async getCardsByUser(userId) {
        return credit_card_model_1.default.findAll({ where: { user_id: userId } });
    }
    async createCard(cardData) {
        return credit_card_model_1.default.create(cardData);
    }
    async getCardById(cardId) {
        return credit_card_model_1.default.findByPk(cardId);
    }
    async updateCard(cardId, cardData) {
        const card = await credit_card_model_1.default.findByPk(cardId);
        if (!card)
            return null;
        await card.update(cardData);
        return card;
    }
    async getExpensesDueSoon(userId, cardId, from, to) {
        return expense_model_1.default.findAll({
            where: {
                user_id: userId,
                credit_card_id: cardId,
                date: {
                    [require('sequelize').Op.between]: [from, to],
                },
            },
        });
    }
}
exports.CreditCardService = CreditCardService;
//# sourceMappingURL=credit-card.service.js.map