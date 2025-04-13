const mysql = require('mysql2/promise');

// const mariadb = require('mariadb');

let pool;

const createPool = () => {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || 'test',
    password: process.env.MYSQL_PASSWORD || "testJestOrJunit",
    database: process.env.MYSQL_DB || "sajda",
    port: process.env.MYSQL_PORT || "3307",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

const getConnection = async () => {
  if (!pool) {
    createPool();
  }
  return pool.getConnection();
};

// getConnection().then((connection) => {
//   console.log('✅ Mysql Database connected');
//   connection.release();
// }).catch((error) => {
//   console.error('❌ Mysql Database connection failed:', error);
// });

module.exports = {
  getConnection
};