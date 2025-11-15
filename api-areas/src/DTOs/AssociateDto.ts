import { IsUUID } from 'class-validator';

export class AssociateDto {
    @IsUUID('4', { message: 'userId deve ser um UUID válido' })
    userId!: string;

    @IsUUID('4', { message: 'areaId deve ser um UUID válido' })
    areaId!: string;
}