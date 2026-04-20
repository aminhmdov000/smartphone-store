const mysql = require('mysql2/promise');


require('dotenv').config(); 

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect(err => {
    if (err) {
        console.log("Error:", err.message);
    } else {
        console.log("It was connected to Railway via .env! ✅");
    }
});

module.exports = connection;
