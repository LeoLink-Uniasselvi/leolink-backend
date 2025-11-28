import { AccessDeniedException, ResourceNotFoundException, ValidationException } from '@/common/exceptions';

export class PostNotFoundException extends ResourceNotFoundException {
  constructor(message: string = 'Post nao encontrado') {
    super('Post', message);
  }
}

export class CategoryNotFoundException extends ResourceNotFoundException {
  constructor(message: string = 'Categoria nao encontrada') {
    super('Categoria', message);
  }
}

export class PostAccessDeniedException extends AccessDeniedException {
  constructor(message: string = 'Voce nao tem permissao para modificar este post') {
    super(message);
  }
}

export class InvalidPostPayloadException extends ValidationException {
  constructor(message: string | string[] = 'Dados do post invalidos') {
    super(message);
  }
}
