import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import {
  I18nValidationException,
  getI18nContextFromRequest,
} from 'nestjs-i18n';
import { HttpStatusMessages } from '@exceptions/constants/http-status-messages.constant';
import { ErrorCodes } from '@exceptions/constants/error-codes.constant';
import { HttpExceptionResponseInterface } from '@exceptions/exception.filter';
import { ApiException } from '@exceptions/app/api.exception';

@Injectable()
export class FormDataRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        let errorCode = 0;
        let errorMessage: string = ErrorCodes[errorCode];
        let errors = Object();

        if (err instanceof I18nValidationException) {
          errorCode = 900422;
          errorMessage = ErrorCodes[errorCode];

          const req = context.switchToHttp().getRequest();
          const i18n = getI18nContextFromRequest(req);

          err.errors.forEach((e) => {
            const errorMessage = [];
            Object.values(e.constraints).forEach((constraint) => {
              const words = constraint.split('|');
              errorMessage.push(i18n.translate(words[0]));
            });

            errors[e.property] = errorMessage;
          });
        }

        if (err instanceof ApiException) {
          const exceptionResponse: HttpExceptionResponseInterface =
            err.getResponse() as HttpExceptionResponseInterface;

          errorCode = exceptionResponse.errorCode;
          errorMessage = exceptionResponse.errorMessage;
          errors = exceptionResponse.errors;
        }

        throw new UnprocessableEntityException({
          status: {
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            message: HttpStatusMessages[422],
          },
          error: {
            code: errorCode,
            message: errorMessage,
            errors,
          },
        });
      }),
    );
  }
}
