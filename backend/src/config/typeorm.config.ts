import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'ft_transcendence',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    autoLoadEntities: true,
    synchronize: true,
}