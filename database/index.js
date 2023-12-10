const sql = require('mysql');

const DB = sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


DB.getConnection((err, conn) => {
    DB.connect((err) => {
        if (err) {
            console.log("Error Connecting DB: ", err);
            return;
        }
        console.log("Database Connected Successfully!");
    });
});

module.exports = DB;
