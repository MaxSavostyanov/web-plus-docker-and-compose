export default () => ({
  port: Number(process.env.SERVER_PORT) || 3000,
  dbHost: process.env.POSTGRES_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbName: process.env.DB_NAME || 'kupipodariday',
  dbUsername: process.env.DB_USERNAME || 'student',
  dbPassword: process.env.DB_PASSWORD || 'student',
  jwtKey: process.env.JWT_SECRET || 'secret_jwt_key',
  jwtExpiers: process.env.JWT_EXPIERS || '7d',
});
