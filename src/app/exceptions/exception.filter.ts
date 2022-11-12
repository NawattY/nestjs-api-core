import {
  ExceptionFilter as ExceptionFilterInterface,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ValidationError,
  UnprocessableEntityException,
  ForbiddenException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodes } from '@exceptions/constants/error-codes.constant';
import { HttpStatusMessages } from '@exceptions/constants/http-status-messages.constant';
import { ApiException } from '@exceptions/app/api.exception';
import {
  FlattenValidationErrors,
  ValidationException,
} from './customs/validation.exception';
import { get } from 'lodash';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { AppConfigService } from 'src/config/app/config.service';
import { CloudWatchLogger } from '@providers/logger/cloudwatch/provider.service';

@Catch()
export class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    private readonly i18n: I18nService,
    @Inject(AppConfigService)
    private readonly appCongigService: AppConfigService,
    @Inject(CloudWatchLogger) private readonly logger: CloudWatchLogger,
  ) {}

  /**
   * Catchs all exception filter
   * @param exception
   * @param host
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 0;
    let errorMessage: string = ErrorCodes[errorCode];
    let errors: string[] = [];

    if (exception instanceof Error) {
      errors = [exception.message];
    }

    if (exception instanceof HttpException) {
      const handleResponse = this.handleHttpException(exception);
      statusCode = handleResponse.statusCode;
      errorCode = handleResponse.errorCode;
      errorMessage = handleResponse.errorMessage;
      errors = handleResponse.errors;
    }

    if (exception instanceof I18nValidationException) {
      const exceptionErrors = get(exception, 'errors');
      const i18nErrors = Object();

      exceptionErrors.forEach((e) => {
        const errorMessage = [];
        Object.values(e.constraints).forEach((constraint) => {
          const words = constraint.split('|');
          errorMessage.push(
            this.i18n.t(words[0], { lang: ctx.getRequest().i18nLang }),
          );
        });

        i18nErrors[e.property] = errorMessage;
      });

      statusCode = exception.getStatus();
      errorCode = 900422;
      errorMessage = ErrorCodes[errorCode];
      errors = i18nErrors;
    }

    const payload = {
      status: {
        code: statusCode,
        message: HttpStatusMessages[statusCode],
      },
      error: {
        code: errorCode,
        message: errorMessage,
        errors,
      },
    } as ErrorResponseInterface;

    if (this.appCongigService.exceptionLogEnabled) {
      const logMessage = `[${ExceptionFilter.name}] exception.log`;

      this.logger.error(logMessage, { payload });
    }

    response.status(statusCode).json(payload);
  }

  /**
   * Handles http exception
   * @param exception
   * @returns HandleHttpExceptionResponseInterface
   */
  private handleHttpException(
    exception: HttpException,
  ): HandleHttpExceptionResponseInterface {
    let errorCode = 0;
    let errorMessage: string = ErrorCodes[errorCode];
    let errors: string[] = [];

    if (exception instanceof ValidationException) {
      const validationErrors = exception.getResponse() as ValidationError[];
      const validationMessages = new FlattenValidationErrors(
        validationErrors,
      ).messages();

      errorCode = 900422;
      errorMessage = ErrorCodes[errorCode];
      errors = Array.isArray(validationMessages)
        ? validationMessages
        : [validationMessages];
    }

    const exceptionResponse: HttpExceptionResponseInterface =
      exception.getResponse() as HttpExceptionResponseInterface;

    if (exception instanceof UnprocessableEntityException) {
      errorCode = 900422;
      errorMessage = ErrorCodes[errorCode];
      if (Array.isArray(exceptionResponse.message)) {
        errors = exceptionResponse.message;
      } else {
        errors = exceptionResponse.message
          ? [exceptionResponse.message]
          : get(exception.getResponse(), 'error.errors', []);
      }
    }

    if (
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException
    ) {
      errorCode = 900403;
      errorMessage = ErrorCodes[errorCode];
    }

    if (exception instanceof ApiException) {
      errorCode = exceptionResponse.errorCode;
      errorMessage = exceptionResponse.errorMessage;
      errors = exceptionResponse.errors;
    }

    return {
      statusCode: exception.getStatus(),
      errorCode,
      errorMessage,
      errors,
    };
  }
}

interface HandleHttpExceptionResponseInterface {
  statusCode: number;
  errorCode: number;
  errorMessage: string;
  errors: string[];
}

export interface HttpExceptionResponseInterface {
  errorCode: number;
  errorMessage: string;
  errors: string[];
  message?: string | string[];
}

export interface ErrorResponseInterface {
  status: { code: number; message: string };
  error: { code: number; message: string; errors: string[] };
}
