// const mysql = require('mysql2/promise');
// require('dotenv').config(); 

// const connection = mysql.createPool(process.env.DATABASE_URL);

// connection.connect(err => {
//     if (err) {
//         console.log("Error:", err.message);
//     } else {
//         console.log("It was connected to Railway via .env! ✅");
//     }
// });

// module.exports = connection;

const mysql = require('mysql2/promise');

// Pool istifadə etmək canlı layihələrdə daha sürətli və stabil işləyir
const pool = mysql.createPool(process.env.DATABASE_URL);

// Bağlantını yoxlamaq üçün kiçik bir test (ixtiyari)
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Railway successfully joined the database with Promise!");
        connection.release(); // Bağlantını hovuza geri qaytarırıq
    } catch (err) {
        console.error("Baza bağlantısında xəta:", err.message);
    }
})();

module.exports = pool;
