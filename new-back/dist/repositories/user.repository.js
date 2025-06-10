"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_model_1.default);
    }
    async findByEmail(email) {
        return this.findOne({
            where: { email },
            attributes: ['id', 'name', 'email', 'password_hash', 'role_id'],
        });
    }
    async findByRole(roleId) {
        return this.findBy({ role_id: roleId });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map