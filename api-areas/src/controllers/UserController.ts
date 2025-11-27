import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../DTOs/CreateUserDto';
import { UserRepository } from '../repositories/UserRepository';

export class UserController {
    static async create(req: Request, res: Response) {
        const dto = plainToInstance(CreateUserDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Erro de validação',
                errors: errors.map(e => Object.values(e.constraints ?? {})).flat()
            });
        }

        const repo = new UserRepository();
        const user = await repo.create(dto.name);
        res.status(201).json(user);
    }
}