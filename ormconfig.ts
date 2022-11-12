import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';

const dbConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  entities: [
    join(__dirname, './src/app/entities/default/**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, './src/database/migrations/default/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/database/migrations/default',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

if (process.env.NODE_ENV === 'test') {
  Object.assign(dbConfig, {});
}

module.exports = dbConfig;
