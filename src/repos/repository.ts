export interface IRepository<T> {
  create(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: number): Promise<void>;
  activate(id: number): Promise<void>;
  find(): Promise<T[]>;
  findWithDeleted(): Promise<T[]>;
  findById(id: number): Promise<T>;
  findByIdWithDeleted(id: number): Promise<T>;
}