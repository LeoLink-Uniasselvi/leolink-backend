
import { IsString, IsNotEmpty, ValidationArguments } from 'class-validator';
import { AreaRepository } from '../repositories/AreaRepository';
import { UniqueAreaName } from '../validators/UniqueAreaName';


export class CreateAreaDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @UniqueAreaName({ message: 'Já existe uma área com esse nome' })
    name!: string;
}

// Validador customizado de nome único
import { registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class UniqueAreaNameConstraint implements ValidatorConstraintInterface {
    async validate(name: string) {
        const repo = new AreaRepository();
        const area = await repo.findByName(name);
        return !area;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Já existe uma área com esse nome';
    }
}
