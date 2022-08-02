import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

//треба доробити ЕНВ
const PostgresDataSource = new DataSource({
  type: 'postgres',
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DB,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  logging: true,
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.js,.ts}'],
});

export default PostgresDataSource;
