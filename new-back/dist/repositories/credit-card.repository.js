"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardRepository = void 0;
const base_repository_1 = require("./base.repository");
const credit_card_model_1 = __importDefault(require("../models/credit-card.model"));
class CreditCardRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(credit_card_model_1.default);
    }
    async findByUserId(userId) {
        return this.findBy({ user_id: userId });
    }
}
exports.CreditCardRepository = CreditCardRepository;
//# sourceMappingURL=credit-card.repository.js.map