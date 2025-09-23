import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class DomainException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

export class ValidationException extends DomainException {
  constructor(message: string | string[] = 'Dados inválidos') {
    super(
      Array.isArray(message) ? message.join(', ') : message,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BusinessRuleException extends DomainException {
  constructor(message: string = 'Regra de negócio violada') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class ResourceNotFoundException extends DomainException {
  constructor(resource: string = 'Recurso', message?: string) {
    super(message || `${resource} não encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class AccessDeniedException extends DomainException {
  constructor(message: string = 'Acesso negado') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
