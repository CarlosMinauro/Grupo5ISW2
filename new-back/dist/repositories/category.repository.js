"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const base_repository_1 = require("./base.repository");
const category_model_1 = __importDefault(require("../models/category.model"));
class CategoryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(category_model_1.default);
    }
    async findByName(name) {
        return this.findOne({ name });
    }
    async findByIds(ids) {
        return this.model.findAll({
            where: {
                id: ids,
            },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=category.repository.js.map