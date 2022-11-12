import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { removeKeys } from '@helpers/remove-keys.helper';

@Injectable()
export class CloudWatchLogger {
  private readonly excepts: string[] = ['password', 'password_confirmation'];

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public baseLogger(): Logger {
    return this.logger;
  }

  public emergency(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.emerg(message, additionals);
  }

  public alert(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.alert(message, additionals);
  }

  public critical(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.crit(message, additionals);
  }

  public error(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.error(message, additionals);
  }

  public warning(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.warning(message, additionals);
  }

  public notice(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.notice(message, additionals);
  }

  public info(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.info(message, additionals);
  }

  public debug(message: string, additionals?: Record<string, any>): void {
    if (typeof additionals !== 'undefined') {
      additionals = removeKeys(additionals, this.excepts);
    }

    this.logger.debug(message, additionals);
  }
}
