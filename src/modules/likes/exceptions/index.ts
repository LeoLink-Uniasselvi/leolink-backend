import { DomainException } from '@/common/exceptions';
import { HttpStatus } from '@nestjs/common';

export class LikeAlreadyExistsException extends DomainException {
  constructor(message: string = 'Curtida ja registrada para este usuario') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class LikeNotFoundException extends DomainException {
  constructor(message: string = 'Curtida nao encontrada') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class LikeTargetNotFoundException extends DomainException {
  constructor(message: string = 'Conteudo para curtida nao encontrado') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class InvalidLikeTargetException extends DomainException {
  constructor(message: string = 'Defina apenas postId ou commentId') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
