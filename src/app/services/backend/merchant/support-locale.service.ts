import { Inject, Injectable, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'lodash';
import { FRONTEND_LOCALE } from '@constants/frontend-locale';
import { I18nService } from 'nestjs-i18n';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class SupportLocaleService {
  private lang = process.env.LOCALE;

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(MerchantEntity)
    private merchantRepository: Repository<MerchantEntity>,
    private readonly i18n: I18nService,
  ) {}

  async get(): Promise<{ title: string; code: string }[]> {
    const merchant = await this.merchantRepository.findOne({
      id: this.request.merchantId,
    });

    const defaultLocale = get(merchant.settings, 'locale');
    const supportLocale = FRONTEND_LOCALE.filter(
      (value) => value !== defaultLocale,
    )
      .sort()
      .map((locale) => {
        return {
          title: this.i18n.t(`service.support_locale_${locale}`, {
            lang: this.lang,
          }),
          code: locale,
        };
      });

    return [
      {
        title: this.i18n.t(`service.support_locale_${defaultLocale}`, {
          lang: this.lang,
        }),
        code: defaultLocale,
      },
      ...supportLocale,
    ];
  }
}
