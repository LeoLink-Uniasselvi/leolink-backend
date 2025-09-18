export interface IRepository<T> {
  create(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
  find(): Promise<T[]>;
  findById(id: string): Promise<T>;
}
