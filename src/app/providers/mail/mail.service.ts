import { MailException } from '@exceptions/app/mail.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CloudWatchLogger } from '@providers/logger/cloudwatch/provider.service';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { AppConfigService } from 'src/config/app/config.service';

@Injectable({ scope: Scope.REQUEST })
export class MailService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private mailerService: MailerService,
    private appConfigService: AppConfigService,
    @Inject(CloudWatchLogger) private readonly logger: CloudWatchLogger,
    private readonly i18n: I18nService,
  ) {}

  /**
   * @param to
   * @param token
   */
  async sendRequestPassword(to: string, token: string, fullName: string) {
    try {
      const urlResetPassword = `${this.appConfigService.backendUrl}/${this.request.locale}/change-password?token=${token}`;

      await this.mailerService.sendMail({
        to,
        subject: this.i18n.t(`service.send_request_password_title`, {
          lang: this.request.locale,
        }),
        template: 'password-reset-request',
        context: {
          urlResetPassword,
          baseUrl: this.appConfigService.url,
          passwordResetLabelSetYourNewPassword: this.i18n.t(
            `service.password_reset_label_set_your_new_password`,
            {
              lang: this.request.locale,
            },
          ),
          passwordResetLabelDear: this.i18n.t(
            `service.password_reset_label_dear`,
            {
              args: { fullName },
              lang: this.request.locale,
            },
          ),
          passwordResetLabelPleaseClickLinkBelow: this.i18n.t(
            `service.password_reset_label_please_click_link_below`,
            {
              lang: this.request.locale,
            },
          ),
          passwordResetBtnResetPassword: this.i18n.t(
            `service.password_reset_btn_reset_password`,
            {
              lang: this.request.locale,
            },
          ),
        },
      });
    } catch (error) {
      this.logger.critical(
        `${MailService.name} - send request password error.`,
      );

      throw MailException.sendEmailFailed();
    }
  }
}
