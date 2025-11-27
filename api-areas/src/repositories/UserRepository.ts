import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User.entity';

export class UserRepository {
    private repo = AppDataSource.getRepository(User);

    async create(name: string): Promise<User> {
        const user = this.repo.create({ name });
        return await this.repo.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.repo.find({ relations: ['userAreas', 'userAreas.area'] });
    }

    async findById(id: string): Promise<User | null> {
        return await this.repo.findOne({ where: { id }, relations: ['userAreas'] });
    }
}