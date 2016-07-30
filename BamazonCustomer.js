
var Table = require('cli-table');
var conn = require('./connection');
var menu = require('./menus');
var inquirer = require('inquirer');

setTimeout(menu.mainMenu, 500);
//	Creating a Item Class
function Item(itemName, itemquantity) {
	this.ProductName = itemName;
	this.StockQuantity = itemquantity;
}
//	Adding a Item Method
Item.getItems = function(callback) {
	conn.connection.query('SELECT * FROM Products', function(err, rows){ 
		if(err) { throw err}
		callback(rows);
	});
}

Item.prototype.save = function() {
	var that = this;
	conn.connection.query('SELECT * FROM Products WHERE ProductName = ? LIMIT 1', [this.ProductName], function(err, rows) {
		if (err) {
			throw err;
		}
		if(rows[0].StockQuantity > that.StockQuantity) {
			var qty  = parseInt(rows[0].StockQuantity) - parseInt(that.StockQuantity);
			var price = rows[0].Price;
			var total = parseInt(that.StockQuantity) * price;
			conn.connection.query('UPDATE Products SET StockQuantity = ? WHERE ProductName = ?', [qty, that.ProductName], function (err, rows) {
				if (err) {
					throw err;
				}
				console.log('Purchase Order: ')
				console.log('Qty Order: ', qty, '\nSale Price: ', price, '\nTotal: ', total);
				console.log('\n\nItem updated .....', total);
			});
		} else {
			console.log('\nOoops Insufficient quantity!\n  There is only ', rows[0].StockQuantity, 'in stock');
		}
		pressAnyKey();
	});
};
Item.prototype.update = function() {
	var that = this;
	conn.connection.query('SELECT * FROM Products WHERE ProductName = ? LIMIT 1', [this.ProductName], function(err, rows) {
		if (err) {
			throw err;
		}
		var qty  = parseInt(rows[0].StockQuantity) + parseInt(that.StockQuantity);
		conn.connection.query('UPDATE Products SET StockQuantity = ? WHERE ProductName = ?', [qty, that.ProductName], function (err, rows) {
			if (err) {
				throw err;
			}
			console.log('\n\nItem updated .....');
		});
		
		pressAnyKey();
	});
};
var displayItems = function() {
	Item.getItems(function(rows) {
		var table = new Table({
			head: ['ItemID', 'ProductName', 'DepartmentName', 'Price', 'StockQuantity'],
			colWidths: [10, 30, 20, 10, 15]
		});
		rows.map(function(row) {
			table.push([row.ItemID, row.ProductName, row.DepartmentName, row.Price, row.StockQuantity]);
		});
		console.log(table.toString());
		pressAnyKey();
	});
}
//	Show Items with a single function
var showItems = function() {
	var table = new Table({
		// head: getColumnsNames('Products', function(columns) {return columns;}),
		head: ['ItemID', 'ProductName', 'DepartmentName', 'Price', 'StockQuantity'],
		colWidths: [10, 30, 20, 10, 15],
	});
	getTableData('Products', function(rows){
		rows.map(function(row){
			table.push([row.ItemID, row.ProductName, row.DepartmentName, row.Price, row.StockQuantity]);
		});
		console.log(table.toString());
		pressAnyKey();
	});

	// conn.connection.query('SELECT * FROM Products', function(err, rows){ 
	// 	if(err) { throw err}
	// 	rows.map(function(row) {
	// 		table.push(
	// 			[row.ItemID, row.ProductName, row.DepartmentName, row.Price, row.StockQuantity]
	// 		);
	// 	});
	// 	console.log(table.toString());
	// 	pressAnyKey();
	// });
}
var showLowInventory = function() {
	var table = new Table({
		// head: getColumnsNames('Products', function(columns) {return columns;}),
		head: ['ItemID', 'ProductName', 'DepartmentName', 'Price', 'StockQuantity'],
		colWidths: [10, 30, 20, 10, 15],
	});
	getTableData('Products', function(rows){
		rows.map(function(row){
			if(row.StockQuantity < 5) {
				table.push([row.ItemID, row.ProductName, row.DepartmentName, row.Price, row.StockQuantity]);	
			}
		});
		console.log(table.toString());
		pressAnyKey();
	});
}

function pressAnyKey() {
	console.log('\n\n\nPress any key to return ..');
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.once('data', function(any) {
		// process.stdout.write(any);
		// process.stdin.setRawMode(false);
		// setTimeout(mainMenu, 500);
		menu.mainMenu();
	});
}

var placeOrders = function() {
	Item.getItems(function(rows) {
		console.log('inside');
		inquirer.prompt([{
			name: 'itemName',
			message: 'Item to buy',
			type: 'list',
			choices: rows.map(function(row) {
				return row.ProductName + ' - ' + row.StockQuantity;
			})
		}, {
			name: 'quantity',
			message: 'Quantity to buy'
		}]).then(function (answer) {//	split to get just the item name without the qty
			var newItem = new Item(answer.itemName.split(' - ')[0], answer.quantity);
				newItem.save();
		});
	});
}
var updateInventory = function() {
	Item.getItems(function(rows) {
		console.log('inside');
		inquirer.prompt([{
			name: 'itemName',
			message: 'Item to update',
			type: 'list',
			choices: rows.map(function(row) {
				return row.ProductName + ' - ' + row.StockQuantity;
			})
		}, {
			name: 'quantity',
			message: 'How many more'
		}]).then(function (answer) {//	split to get just the item name without the qty
			var newItem = new Item(answer.itemName.split(' - ')[0], answer.quantity);
				newItem.update();
		});
	});
}
var getColumnsNames = function(table, callback) {
	conn.connection.query('SHOW COLUMNS FROM ' + table, function(err, rows, fields){
		var columns = rows.map(function(row){
				return row.Field;
		});
		callback(columns);
		// console.log(columns);
	});
}

var getTableData = function(table, callback) {
	conn.connection.query('SELECT * FROM Products', function(err, rows){
		if(err) {
			throw err;
		}
		callback(rows);
	});
}

exports.displayItems = displayItems;
exports.showItems = showItems;
exports.placeOrders = placeOrders;
exports.showLowInventory = showLowInventory;
exports.updateInventory = updateInventory;
