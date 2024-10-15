import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Entities } from './entities';
import { Dialect } from 'sequelize';

export const connection = SequelizeModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    dialect: configService.get<Dialect>('database.dialect'),
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port') || 5432,
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    schema: configService.get<string>('database.schema'),
    models: [...Entities],
    pool: {
      max: 10,
      min: 3,
    },
    autoLoadModels: true,
    synchronize: true,
  }),
  inject: [ConfigService],
});
