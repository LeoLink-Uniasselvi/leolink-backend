import { DomainException } from '@/common/exceptions';
import { HttpStatus } from '@nestjs/common';

export class PostNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Post com ID '${id}' não encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class PostAlreadyDeletedException extends DomainException {
  constructor(id: string) {
    super(`Post com ID '${id}' já foi deletado`, HttpStatus.GONE);
  }
}

export class UnauthorizedPostAccessException extends DomainException {
  constructor() {
    super('Você não tem permissão para acessar este post', HttpStatus.FORBIDDEN);
  }
}
