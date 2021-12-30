export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiUrl: process.env.API_URL || 'http://localhost:3001/',
  database: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
  },
  queue: {
    host: process.env.QUEUE_HOST,
    port: parseInt(process.env.QUEUE_PORT, 10),
  },
});
