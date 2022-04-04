module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: ['src/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  seeds: ['src/seeds/*.ts'],
  factories: ['src/factories/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
  },
};
