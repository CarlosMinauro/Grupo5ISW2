export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
  findBy(where: Partial<T>): Promise<T[]>;
  findOne(where: Partial<T>): Promise<T | null>;
} 