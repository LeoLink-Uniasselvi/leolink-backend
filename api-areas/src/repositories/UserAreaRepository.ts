import { Area } from '@entities/Area.entity';
import { AppDataSource } from '../database/data-source';
import { UserArea } from '../entities/UserArea.entity';
import { User } from '@entities/User.entity';

export class UserAreaRepository {
    private repo = AppDataSource.getRepository(UserArea);

    async associate(userId: string, areaId: string): Promise<UserArea> {
        const userArea = this.repo.create({ userId, areaId });
        return await this.repo.save(userArea);
    }

    async findByUserId(userId: string): Promise<UserArea[]> {
        return await this.repo.find({
            where: { userId },
            relations: ['area'],
        });
    }

    async findByAreaId(areaId: string): Promise<UserArea[]> {
        return await this.repo.find({
            where: { areaId },
            relations: ['user'],
        });
    }

    async remove(userId: string, areaId: string): Promise<void> {
        await this.repo.delete({ userId, areaId });
    }
    async findUsersByAreaId(areaId: string): Promise<User[]> {
        const associations = await this.repo.find({
            where: { areaId },
            relations: ['user'],
        });
        return associations.map(a => a.user);
    }

    async findAreasByUserId(userId: string): Promise<Area[]> {
        const associations = await this.repo.find({
            where: { userId },
            relations: ['area'],
        });
        return associations.map(a => a.area);
    }
}