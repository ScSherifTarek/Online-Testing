'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
	host     : process.env.DB_HOST || "localhost",
	user     : process.env.DB_USER || "root",
	password : process.env.DB_PASS || "root",
    database : process.env.DB_NAME || "online_testing"
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;