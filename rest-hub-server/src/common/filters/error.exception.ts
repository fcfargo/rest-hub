import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
@Injectable()
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as string | { error: string; message: string | string[] })
        : 'Internal server error';

    if (status >= 500) {
      try {
        throw exception;
      } catch (err) {
        const error = {
          query: request.query,
          params: request.params,
          body: request.body,
          name: err.name,
          message: err.message,
          stack: err.stack,
        };
        this.logger.error('FallbackError', error);
      }
    } else {
      this.logger.info(`[EXCEPTION] ${request.method} ${request.url} ${status}`, {
        messge: JSON.stringify(message),
      });
    }

    response.status(status).json({
      code: status,
      body: null,
      error: message,
      method: request.method,
      path: request.url,
    });
  }
}
