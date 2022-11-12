import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoConfigSchema } from './config.schema';
import { MongoConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: MongoConfigSchema,
    }),
  ],
  providers: [MongoConfigService],
  exports: [MongoConfigService],
})
export class MongoConfigModule {}
