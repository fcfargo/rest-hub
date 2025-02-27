import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const code = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => ({
        code,
        message: 'success',
        body: data,
      })),
    );
  }
}
