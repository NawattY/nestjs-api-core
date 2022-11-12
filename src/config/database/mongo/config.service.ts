import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConfigService {
  constructor(private configService: ConfigService) {}

  get uri(): string {
    return this.configService.get<string>('MONGO_DB_URI');
  }
}
