const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect(err => {
    if (err) {
        console.log("Error:", err.message);
    } else {
        console.log("It was connected to Railway via .env! ✅");
    }
});

module.exports = connection;
