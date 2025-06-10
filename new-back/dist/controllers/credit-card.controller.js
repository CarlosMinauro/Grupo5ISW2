"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardController = void 0;
const credit_card_service_1 = require("../services/credit-card.service");
const moment_1 = __importDefault(require("moment"));
class CreditCardController {
    constructor() {
        this.creditCardService = new credit_card_service_1.CreditCardService();
    }
    async getCards(req, res) {
        try {
            const user = req.user;
            if (!user || !user.id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
            const cards = await this.creditCardService.getCardsByUser(user.id);
            const mappedCards = cards.map(card => ({
                id: card.id,
                user_id: card.user_id,
                card_number: card.card_number,
                expiry_date: card.expiration_date instanceof Date
                    ? (0, moment_1.default)(card.expiration_date).format('YYYY-MM-DD')
                    : card.expiration_date,
                card_holder_name: card.card_holder_name,
                brand: card.brand,
                bank: card.bank,
                is_active: card.is_active,
                created_at: card.created_at instanceof Date
                    ? card.created_at.toISOString()
                    : card.created_at,
            }));
            return res.json({ cards: mappedCards });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching cards' });
        }
    }
    async addCard(req, res) {
        try {
            const user = req.user;
            if (!user || !user.id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
            const { card_number, card_holder_name, expiry_date, brand, bank } = req.body;
            if (!card_number || !card_holder_name || !expiry_date) {
                return res.status(400).json({ message: 'Faltan campos obligatorios' });
            }
            let expiration_date = null;
            if (expiry_date) {
                const parsed = (0, moment_1.default)(expiry_date, 'MM/YY');
                if (!parsed.isValid()) {
                    return res.status(400).json({ message: 'Formato de fecha inválido. Use MM/YY.' });
                }
                expiration_date = parsed.endOf('month').toDate();
            }
            const cardData = {
                user_id: user.id,
                card_number,
                card_holder_name,
                expiration_date,
                brand,
                bank,
                is_active: true,
                created_at: new Date(),
            };
            const newCard = await this.creditCardService.createCard(cardData);
            const mappedCard = {
                id: newCard.id,
                user_id: newCard.user_id,
                card_number: newCard.card_number,
                expiry_date: newCard.expiration_date instanceof Date ? newCard.expiration_date.toISOString().slice(0, 10) : newCard.expiration_date,
                card_holder_name: newCard.card_holder_name,
                brand: newCard.brand,
                bank: newCard.bank,
                is_active: newCard.is_active,
                created_at: newCard.created_at instanceof Date ? newCard.created_at.toISOString() : newCard.created_at,
            };
            return res.status(201).json({ card: mappedCard });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error adding card' });
        }
    }
}
exports.CreditCardController = CreditCardController;
//# sourceMappingURL=credit-card.controller.js.map