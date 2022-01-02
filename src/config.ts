export default () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  appUrl:
    process.env.APP_URL ||
    `http://localhost:${parseInt(process.env.APP_PORT, 10) || 3000}/api/`,
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
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
  },
});
