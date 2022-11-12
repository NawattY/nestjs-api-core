import { Module } from '@nestjs/common';
import { ConfigProviderModule } from '@providers/config/provider.module';
import {
  GraylogModule,
  GraylogModuleOptions,
  GraylogModuleOptionsAsync,
} from 'nestjs-graylog';
import { GraylogConfigService } from 'src/config/logger/graylog/config.service';

@Module({
  imports: [
    GraylogModule.registerAsync({
      imports: [ConfigProviderModule],
      inject: [GraylogConfigService],
      useFactory: (
        graylogConfigService: GraylogConfigService,
      ): GraylogModuleOptions => ({
        servers: [
          {
            host: graylogConfigService.host,
            port: graylogConfigService.port,
          },
        ],
        facility: graylogConfigService.facility,
        bufferSize: 262144,
      }),
    } as GraylogModuleOptionsAsync),
  ],
  providers: [],
  exports: [GraylogModule],
})
export class GraylogProviderModule {}
