// src/controllers/AreaController.ts
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAreaDto } from '../DTOs/CreateAreaDto';
import { UpdateAreaDto } from '../DTOs/UpdateAreaDtos';
import { AreaRepository } from '../repositories/AreaRepository';
import { UserAreaRepository } from '../repositories/UserAreaRepository';

export class AreaController {
    static async create(req: Request, res: Response) {
        const dto = plainToInstance(CreateAreaDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) return res.status(400).json({ errors: errors.map(e => Object.values(e.constraints ?? {})).flat() });

        const repo = new AreaRepository();
        const area = await repo.create(dto.name);
        res.status(201).json(area);
    }

    static async list(req: Request, res: Response) {
        const repo = new AreaRepository();
        const areas = await repo.findAll();
        res.json(areas);
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const repo = new AreaRepository();
        const area = await repo.findById(id);
        if (!area) return res.status(404).json({ error: 'Área não encontrada' });
        res.json(area);
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const dto = plainToInstance(UpdateAreaDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) return res.status(400).json({ errors: errors.map(e => Object.values(e.constraints ?? {})).flat() });

        const repo = new AreaRepository();
        const area = await repo.update(id, dto);
        if (!area) return res.status(404).json({ error: 'Área não encontrada' });
        res.json(area);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const repo = new AreaRepository();
        await repo.delete(id);
        res.status(204).send();
    }

    static async getUsers(req: Request, res: Response) {
        const { areaId } = req.params;
        const repo = new UserAreaRepository();
        const users = await repo.findUsersByAreaId(areaId);
        res.json(users);
    }
}