import { Module } from '@nestjs/common';
import {
  MongooseModule,
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigProviderModule } from '@providers/config/provider.module';
import { MongoConfigService } from 'src/config/database/mongo/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigProviderModule],
      inject: [MongoConfigService],
      useFactory: (
        mongoConfigService: MongoConfigService,
      ): MongooseModuleOptions => ({
        uri: mongoConfigService.uri,
      }),
    } as MongooseModuleAsyncOptions),
  ],
  exports: [MongooseModule],
})
export class DatabaseMongoProviderModule {}
