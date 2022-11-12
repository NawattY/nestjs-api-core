import { Module } from '@nestjs/common';
import {
  WinstonModule,
  WinstonModuleAsyncOptions,
  WinstonModuleOptions,
} from 'nest-winston';
import { config } from 'winston';
import { CloudWatchTransport } from './provider.transport';
import { CloudWatchLogger } from './provider.service';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { CloudWatchConfigService } from 'src/config/logger/cloudwatch/config.service';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigProviderModule],
      inject: [CloudWatchConfigService],
      useFactory: (
        cloudWatchConfigService: CloudWatchConfigService,
      ): WinstonModuleOptions => {
        return {
          levels: config.syslog.levels,
          transports: [
            new CloudWatchTransport({
              level: 'debug',
              logGroupName: cloudWatchConfigService.logGroupName,
              logStreamName: cloudWatchConfigService.logStreamName,
              awsOptions: {
                credentials: {
                  accessKeyId: cloudWatchConfigService.accessKeyId,
                  secretAccessKey: cloudWatchConfigService.secretAccessKey,
                },
                region: cloudWatchConfigService.region,
              },
              jsonMessage: true,
            }),
          ],
        };
      },
    } as WinstonModuleAsyncOptions),
  ],
  providers: [CloudWatchLogger],
  exports: [CloudWatchLogger],
})
export class CloudWatchProviderModule {}
