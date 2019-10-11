// get the client
const mysql = require('mysql2');


// create the connection to database
const connection = mysql.createPool({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7307084',
  password: 'zsPFMcrDr7',
  port: '3306',
  database: 'sql7307084',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// connection.connect(function(err) {
//   if (err) return console.error(err);
//   console.log("Connected!");
// });

module.exports = connection;
