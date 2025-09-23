import { DomainException } from '@/common/exceptions';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends DomainException {
  constructor(message: string = 'Usuário não encontrado') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor(message: string = 'Usuário já existe') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class UserNotActiveException extends DomainException {
  constructor(message: string = 'Usuário não está ativo') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
