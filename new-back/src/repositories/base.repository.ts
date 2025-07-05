import { Model, ModelCtor } from 'sequelize';
import { IRepository } from '../interfaces/repository';

export abstract class BaseRepository<T extends Model> implements IRepository<T> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return this.model.findAll();
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data as any);
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const instance = await this.findById(id);
    if (!instance) return null;
    return instance.update(data as any);
  }

  async delete(id: number): Promise<boolean> {
    const instance = await this.findById(id);
    if (!instance) return false;
    await instance.destroy();
    return true;
  }

  async findBy(where: Partial<T>): Promise<T[]> {
    return this.model.findAll({ where: where as any });
  }

  async findOne(options: any): Promise<T | null> {
    return this.model.findOne(options);
  }
} 