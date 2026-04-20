const mysql = require('mysql2/promise');
const pool = mysql.createPool(process.env.DATABASE_URL);

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Railway successfully joined the database with Promise!");
        connection.release();
    } catch (err) {
        console.error("Error:", err.message);
    }
})();

module.exports = pool;
