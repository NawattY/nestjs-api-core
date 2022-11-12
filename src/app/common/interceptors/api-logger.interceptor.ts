import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { CloudWatchLogger } from '@providers/logger/cloudwatch/provider.service';
import { AppConfigService } from 'src/config/app/config.service';

export class ApiLoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(AppConfigService)
    private readonly appCongigService: AppConfigService,
    @Inject(CloudWatchLogger) private readonly logger: CloudWatchLogger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    if (!this.appCongigService.httpLogEnabled) {
      return next.handle();
    }

    const requestedTime = Date.now();
    const req: Request = context.switchToHttp().getRequest();
    const logMessage = `[${ApiLoggerInterceptor.name}] api.request-response.log`;

    const payload = {
      clientId: req.ip,
      requestHostname: req.hostname,
      requestUrl: `${req.method} ${req.originalUrl}`,
      requestData: this.requestData(req),
      requestedAt: new Date(requestedTime).toString(),
    };

    return next.handle().pipe(
      tap({
        next: (data: Record<string, any>) => {
          const respondedTime = Date.now();

          Object.assign(payload, { reponseData: data });
          Object.assign(payload, {
            repondedAt: `${new Date(respondedTime).toString()} (+${
              respondedTime - requestedTime
            } ms)`,
          });

          this.logger.info(`${logMessage} (OK)`, { payload });
        },
        error: (error: Record<string, any>) => {
          const respondedTime = Date.now();

          // @TODO The format is not exactly format of actual response,
          // because the error format in this log executed before an exception filter handler
          // the actual response format can be watch on EXCEPTION_LOG_ENABLED=true
          Object.assign(payload, { reponseData: error });
          Object.assign(payload, {
            repondedAt: `${new Date(respondedTime).toString()} (+${
              respondedTime - requestedTime
            } ms)`,
          });

          this.logger.info(`${logMessage} (ERROR)`, { payload });
        },
      }),
    );
  }

  private requestData(req: Request): Record<string, any> {
    return {
      body: req.body || [],
      headers: req.headers || [],
    };
  }
}
