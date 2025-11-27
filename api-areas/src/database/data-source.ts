
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: false,
    logging: false,
    entities: ['src/entities/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    migrationsRun: true,
});