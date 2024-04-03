const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: "rodrigopc",
  host: "localhost",
  database: "rodrigopc",
  password: "testedb",
  port: "5433"
});

module.exports = pool;

