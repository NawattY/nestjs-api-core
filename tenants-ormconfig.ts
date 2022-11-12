import * as ormconfig from './ormconfig';
import { join } from 'path';

module.exports = {
  ...ormconfig,
  entities: [join(__dirname, './src/app/entities/tenant/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './src/database/migrations/tenant/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/database/migrations/tenant',
  },
};
