import { AppDataSource } from '../database/data-source';
import { Area } from '../entities/Area.entity';

export class AreaRepository {
    private repo = AppDataSource.getRepository(Area);

    async create(name: string): Promise<Area> {
        const area = this.repo.create({ name });
        return await this.repo.save(area);
    }

    async findAll(): Promise<Area[]> {
        return await this.repo.find({ relations: ['userAreas', 'userAreas.user'] });
    }

    async findById(id: string): Promise<Area | null> {
        return await this.repo.findOne({ where: { id } });
    }
    async findByName(name: string): Promise<Area | null> {
        return await this.repo.findOne({ where: { name } });
    }
    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async update(id: string, data: Partial<Area>): Promise<Area> {
        await this.repo.update(id, data);
        return this.findById(id)!;
    }

}