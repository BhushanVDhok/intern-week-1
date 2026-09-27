const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'facility_mgmt_db',
  connectionTimeoutMillis: 2000
});

let isPostgresConnected = false;

// Check connection
pool.connect()
  .then(client => {
    isPostgresConnected = true;
    console.log('✓ Successfully connected to PostgreSQL database: ' + (process.env.DB_NAME || 'facility_mgmt_db'));
    client.release();
  })
  .catch(err => {
    console.warn('⚠️  PostgreSQL connection unavailable (' + err.message + '). Operating with memory fallback store.');
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  isPostgresConnected: () => isPostgresConnected,
  pool
};
