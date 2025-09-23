import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '@/common/dtos/base-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.constructor.name.replace('Exception', '');
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || 'Erro interno do servidor';
        error =
          (responseObj.error as string) ||
          exception.constructor.name.replace('Exception', '');
      } else {
        message = 'Erro interno do servidor';
        error = 'Internal Server Error';
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
      error = 'Internal Server Error';

      // Log do erro para desenvolvimento
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
      error = 'Internal Server Error';

      this.logger.error(
        `Unknown exception type: ${typeof exception}`,
        JSON.stringify(exception),
        `${request.method} ${request.url}`,
      );
    }

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      error,
    };

    // Log da resposta de erro
    this.logger.warn(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`,
    );

    response.status(status).json(errorResponse);
  }
}
