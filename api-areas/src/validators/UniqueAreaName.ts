// src/validators/UniqueAreaName.ts
import { registerDecorator, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { AreaRepository } from '../repositories/AreaRepository';

@ValidatorConstraint({ name: 'uniqueAreaName', async: true })
export class UniqueAreaNameConstraint implements ValidatorConstraintInterface {
    async validate(name: string) {
        const repo = new AreaRepository();
        transaction: 'none';
        const area = await repo.findByName(name);
        return !area;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Já existe uma área com o nome "${args.value}"';
    }
}

export function UniqueAreaName(validationOptions?: any) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueAreaNameConstraint,
        });
    };
}