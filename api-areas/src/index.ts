import 'reflect-metadata';
import './app';
import { AppDataSource } from './database/data-source.ts';
import { AreaRepository } from './repositories/AreaRepository.ts';
import { UserRepository } from './repositories/UserRepository.ts';
import { UserAreaRepository } from './repositories/UserAreaRepository.ts';


async function main() {
    await AppDataSource.initialize();
    console.log('Banco conectado!');

    const areaRepo = new AreaRepository();
    const userRepo = new UserRepository();
    const userAreaRepo = new UserAreaRepository();

    // Criar área
    const area = await areaRepo.create('Desenvolvimento');
    console.log('Área criada:', area);

    // Criar usuário
    const user = await userRepo.create('João');
    console.log('Usuário criado:', user);

    // Associar
    await userAreaRepo.associate(user.id, area.id);
    console.log('Associação criada!');

    // Listar áreas com usuários
    const areas = await areaRepo.findAll();
    console.log('Áreas com usuários:', areas);
}

main().catch(console.error);