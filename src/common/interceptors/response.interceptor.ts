import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<{
      statusCode: number;
      status: (code: number) => void;
    }>();

    return next.handle().pipe(
      map((data: unknown) => {
        // Se o dado já está formatado como BaseResponseDto, retorna como está
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'message' in data &&
          'statusCode' in data &&
          'timestamp' in data
        ) {
          // Ajusta o status code da resposta HTTP para coincidir com o statusCode do BaseResponseDto
          const baseResponse = data as BaseResponseDto<T>;
          response.status(baseResponse.statusCode);
          return baseResponse;
        }

        // Se tem uma propriedade message no primeiro nível, usa como mensagem
        let message = 'Operação realizada com sucesso';
        let actualData: T = data as T;

        if (data && typeof data === 'object' && 'message' in data) {
          const dataObj = data as Record<string, unknown>;
          message = dataObj.message as string;
          // Remove a mensagem dos dados e usa o resto como data
          const restData = { ...dataObj };
          delete restData.message;
          actualData = (
            Object.keys(restData).length === 1
              ? Object.values(restData)[0]
              : restData
          ) as T;
        }

        const statusCode = response.statusCode || 200;

        return new BaseResponseDto(actualData, message, statusCode);
      }),
    );
  }
}
