import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserPasswordInterceptor implements NestInterceptor {
  private removePassword(obj) {
    for (const prop in obj) {
      if (prop === 'password') {
        delete obj[prop];
      } else if (typeof obj[prop] === 'object') {
        this.removePassword(obj[prop]);
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return data;
        }
        this.removePassword(data);
        return data;
      }),
    );
  }
}
