import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class LoggerErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(error =>
        throwError(() => {
          const res = context.switchToHttp().getResponse();

          if (res.raw) res.raw.err = error;
          else res.err = error;

          return error;
        }),
      ),
    );
  }
}
