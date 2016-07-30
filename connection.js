var mysql = require('mysql');

var connection = mysql.createConnection({
	user: 'root',
	password: '',
	host: 'localhost',
	port: 3306,
	database: 'Bamazon_DB'
});

connection.connect(function (err) {
		if (err) {
			throw err;
		}
		console.log('successfully connected to your DB!\n');
});

exports.connection = connection;