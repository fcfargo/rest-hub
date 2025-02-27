import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { processEnv } from '@/common/constants';
import { User } from '@/model/user.entity';

dotenv.config({ path: 'config/.env' });

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: processEnv.DB_HOST,
  database: processEnv.DB_NAME,
  port: parseInt(processEnv.DB_PORT),
  username: processEnv.DB_USERNAME,
  password: processEnv.DB_PASSWORD,
  entities: [User],
  synchronize: true,
};
