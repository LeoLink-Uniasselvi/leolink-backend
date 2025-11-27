// src/migrations/1736712345678-CreateInitialTables.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInitialTables1736712345678 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'areas',
                columns: [
                    { name: 'id', type: 'varchar', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                    { name: 'name', type: 'varchar' },
                    { name: 'timestamp', type: 'datetime', default: "datetime('now')" },
                ],
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    { name: 'id', type: 'varchar', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                    { name: 'name', type: 'varchar' },
                ],
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: 'user_areas',
                columns: [
                    { name: 'id', type: 'varchar', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                    { name: 'userId', type: 'varchar' },
                    { name: 'areaId', type: 'varchar' },
                    { name: 'timestamp', type: 'datetime', default: "datetime('now')" },
                ],
                foreignKeys: [
                    { columnNames: ['userId'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE' },
                    { columnNames: ['areaId'], referencedTableName: 'areas', referencedColumnNames: ['id'], onDelete: 'CASCADE' },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_areas');
        await queryRunner.dropTable('users');
        await queryRunner.dropTable('areas');
    }
}