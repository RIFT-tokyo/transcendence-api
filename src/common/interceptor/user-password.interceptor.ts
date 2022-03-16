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
  private removeProps(obj: any, props: string[]) {
    for (const prop in obj) {
      if (props.indexOf(prop) !== -1) {
        delete obj[prop];
      } else if (typeof obj[prop] === 'object') {
        this.removeProps(obj[prop], props);
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return data;
        }
        this.removeProps(data, ['password', 'intra_id']);
        return data;
      }),
    );
  }
}
