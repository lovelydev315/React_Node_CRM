require("dotenv").config();

module.exports = {
  IS_PROD: false,
  NODE_ENV: 'development',
  PORT: 5000,
  HOST: localhost,
  DB_USERNAME: 'root',
  DB_PASSWORD: '',
  DB_CLUSTER: 'yourDBcluster',
  SESS_SECRET: 'yourSessionSecret',
  COOKIE_NAME: 'your-session-cookie-name',
};