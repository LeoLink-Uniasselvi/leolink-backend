import { BadRequestException } from '@nestjs/common';

export class CannotFollowSelfException extends BadRequestException {
  constructor() {
    super('Você não pode seguir a si mesmo');
  }
}

export class AlreadyFollowingException extends BadRequestException {
  constructor() {
    super('Você já está seguindo este usuário');
  }
}

export class NotFollowingException extends BadRequestException {
  constructor() {
    super('Você não está seguindo este usuário');
  }
}

export class UserNotFoundException extends BadRequestException {
  constructor() {
    super('Usuário não encontrado');
  }
}