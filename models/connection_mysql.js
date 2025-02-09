const mysql = require('mysql2/promise');

let pool;

const createPool = () => {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
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

getConnection().then((connection) => {
  console.log('✅ Mysql Database connected');
  connection.release();
});

module.exports = {
  getConnection
};