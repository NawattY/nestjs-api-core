import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PgConfigSchema } from './config.schema';
import { PgConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: PgConfigSchema,
    }),
  ],
  providers: [PgConfigService],
  exports: [PgConfigService],
})
export class PgConfigModule {}
