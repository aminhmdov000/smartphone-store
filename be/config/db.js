// MySQL2 connection pool for database operations
const mysql = require('mysql2');
//CREATE A CONNECTION POOL TO THE DATABASE USING ENV VARIABLES FOR CONFIGURATION
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool.promise(); // export the pool with promise support for async/await usage in controllers
 
//db.query("SELECT ...", (err, results) => {}) 
// --> db.query("SELECT ...") returns a promise that resolves to [results, fields]
//In controllers, we can use async/await to handle database queries more cleanly, without callbacks.