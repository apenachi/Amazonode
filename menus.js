var createMenu = require('simple-terminal-menu');
var ac = require('./BamazonCustomer');

var menuOpts = {
		x: 20,
		y: 05	
};
var showSelection = function (label, marker) {
	console.log('Ooopss Funcionality no implemented ..!!');
	console.log('Selection: ',label);
}
var mainMenu = function() {
	var menu = createMenu(menuOpts);
	menu.writeLine('Main Menu');
	menu.writeSeparator();
	menu.add('Display Items', ac.displayItems);
	menu.add('Place Orders', ac.placeOrders);
	menu.writeSeparator();
	menu.add('Manager Menu', managerMenu);
	menu.add('Executive Menu', executiveMenu);
	menu.add('Exit', menu.close);
}
var managerMenu = function() {
	var menu = createMenu(menuOpts);
	menu.writeLine('Manager Menu');;
	menu.writeSeparator();
	menu.add('Products For Sale', ac.showItems);
	menu.add('View Low Inventory', ac.showLowInventory);
	menu.add('Update To Invetory', ac.updateInventory);
	menu.add('Add New Product', showSelection);
	menu.writeSeparator();
	menu.add('Main Menu', mainMenu);
	menu.add('Exit', menu.close);
}

var executiveMenu = function() {
	var menu = createMenu(menuOpts);
	menu.writeLine('Executive Menu');;
	menu.writeSeparator();
	menu.add('Products Sale By Department', showSelection);
	menu.add('Create New Department', showSelection);
	menu.writeSeparator();
	menu.add('Main Menu', mainMenu);
	menu.add('Exit', menu.close);
}

module.exports.mainMenu = mainMenu;
module.exports.managerMenu = managerMenu;
module.exports.executiveMenu = executiveMenu;

