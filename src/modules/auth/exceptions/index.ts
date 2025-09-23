import { DomainException } from '@/common/exceptions';
import { HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends DomainException {
  constructor(message: string = 'Email ou senha inválidos') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class SessionNotFoundException extends DomainException {
  constructor(message: string = 'Sessão não encontrada') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class SessionExpiredException extends DomainException {
  constructor(message: string = 'Sessão expirada') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class SessionRevokedException extends DomainException {
  constructor(message: string = 'Sessão foi revogada') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidPasswordException extends DomainException {
  constructor(message: string = 'Senha atual inválida') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
