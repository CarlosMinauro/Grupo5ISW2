"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetRepository = void 0;
const base_repository_1 = require("./base.repository");
const password_reset_model_1 = __importDefault(require("../models/password-reset.model"));
const sequelize_1 = require("sequelize");
class PasswordResetRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(password_reset_model_1.default);
    }
    async findByToken(token) {
        return this.findOne({ token });
    }
    async findByUserId(userId) {
        return this.findBy({ usuarioId: userId });
    }
    async deleteExpiredTokens() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const result = await this.model.destroy({
            where: {
                created_at: {
                    [sequelize_1.Op.lt]: oneHourAgo,
                },
            },
        });
        return result;
    }
    async deleteUserTokens(userId) {
        const result = await this.model.destroy({
            where: {
                usuarioId: userId,
            },
        });
        return result;
    }
}
exports.PasswordResetRepository = PasswordResetRepository;
//# sourceMappingURL=password-reset.repository.js.map