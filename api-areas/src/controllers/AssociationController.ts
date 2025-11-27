// src/controllers/AssociationController.ts
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AssociateDto } from '../DTOs/AssociateDto';
import { UserAreaRepository } from '../repositories/UserAreaRepository';

export class AssociationController {
    static async associate(req: Request, res: Response) {
        const dto = plainToInstance(AssociateDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) return res.status(400).json({ errors: errors.map(e => Object.values(e.constraints ?? {})).flat() });

        const repo = new UserAreaRepository();
        const assoc = await repo.associate(dto.userId, dto.areaId);
        res.status(201).json(assoc);
    }

    static async remove(req: Request, res: Response) {
        const { userId, areaId } = req.body;
        const repo = new UserAreaRepository();
        await repo.remove(userId, areaId);
        res.status(204).send();
    }

    static async getUserAreas(req: Request, res: Response) {
        const { userId } = req.params;
        const repo = new UserAreaRepository();
        const areas = await repo.findAreasByUserId(userId);
        res.json(areas);
    }
}