var inquirer = require('inquirer');

inquirer.prompt([{
		type: 'list',
		choices: ['Bid', 'Post'],
		message: 'Please Select One',
		name: 'bidpost'
},
{
		type: 'list',
		choices: ['Items', 'Tasks', 'Jobs', 'Projects'],
		message: 'Please Select One',
		name: 'categories'
}
]).then(function(answers) {
	console.log(answers);

});



	// process.stdout.write('\033c');
	// inquirer.prompt(questions).then(function(answer) {
	// 	if(answer) {
	// 		console.log(answer.bidpost);
	// 		console.log(answer.categories);
	// 		if(answer.bidpost === 'Post') {
	// 			makePost(answer.categories);
	// 		} else {
	// 			makeBid(answer.categories);
	// 		}
	// 	}
	// });
