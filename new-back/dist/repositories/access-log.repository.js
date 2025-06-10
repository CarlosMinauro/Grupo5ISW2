"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLogRepository = void 0;
const base_repository_1 = require("./base.repository");
const access_log_model_1 = __importDefault(require("../models/access-log.model"));
const sequelize_1 = require("sequelize");
class AccessLogRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(access_log_model_1.default);
    }
    async findByUserId(userId) {
        return this.findBy({ user_id: userId });
    }
    async findByDateRange(userId, startDate, endDate) {
        return this.model.findAll({
            where: {
                user_id: userId,
                access_time: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            order: [['access_time', 'DESC']],
        });
    }
    async getFirstAccess(userId) {
        return this.model.findOne({
            where: {
                user_id: userId,
                firstaccess: true,
            },
        });
    }
    async getLastAccess(userId) {
        return this.model.findOne({
            where: {
                user_id: userId,
            },
            order: [['access_time', 'DESC']],
        });
    }
}
exports.AccessLogRepository = AccessLogRepository;
//# sourceMappingURL=access-log.repository.js.map