import { AccessDeniedException, ResourceNotFoundException, BusinessRuleException } from '@/common/exceptions';

/**
 * Exception thrown when a requested comment cannot be found.
 */
export class CommentNotFoundException extends ResourceNotFoundException {
  constructor(message: string = 'Comentário não encontrado') {
    super('Comentário', message);
  }
}

/**
 * Exception thrown when the specified post does not exist.
 */
export class PostNotFoundException extends ResourceNotFoundException {
  constructor(message: string = 'Post não encontrado') {
    super('Post', message);
  }
}

/**
 * Exception thrown when a reply is attempted on a non-existent parent comment.
 */
export class ParentCommentNotFoundException extends ResourceNotFoundException {
  constructor(message: string = 'Comentário pai não encontrado') {
    super('Comentário Pai', message);
  }
}

/**
 * Exception thrown when a reply references a parent that belongs to a
 * different post or exceeds the maximum depth.
 */
export class InvalidParentCommentException extends BusinessRuleException {
  constructor(message: string = 'Comentário pai inválido') {
    super(message);
  }
}

/**
 * Exception thrown when a user attempts to update or delete a comment
 * they do not own.
 */
export class UnauthorizedCommentActionException extends AccessDeniedException {
  constructor(message: string = 'Você não tem permissão para modificar este comentário') {
    super(message);
  }
}