import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@/common/exceptions';

export class RoleNotFoundException extends DomainException {
  constructor(message: string = 'Funcao nao encontrada') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class RoleAlreadyExistsException extends DomainException {
  constructor(message: string = 'Funcao ja existe') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class RoleInUseException extends DomainException {
  constructor(message: string = 'Funcao em uso por usuarios') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class RoleAlreadyAssignedException extends DomainException {
  constructor(message: string = 'Usuario ja possui esta funcao') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class RoleNotAssignedException extends DomainException {
  constructor(message: string = 'Funcao nao atribuida ao usuario') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class RoleInactiveException extends DomainException {
  constructor(message: string = 'Funcao esta inativa') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
