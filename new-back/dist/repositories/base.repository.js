"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findAll() {
        return this.model.findAll();
    }
    async findById(id) {
        return this.model.findByPk(id);
    }
    async create(data) {
        return this.model.create(data);
    }
    async update(id, data) {
        const instance = await this.findById(id);
        if (!instance)
            return null;
        return instance.update(data);
    }
    async delete(id) {
        const instance = await this.findById(id);
        if (!instance)
            return false;
        await instance.destroy();
        return true;
    }
    async findBy(where) {
        return this.model.findAll({ where: where });
    }
    async findOne(options) {
        return this.model.findOne(options);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map