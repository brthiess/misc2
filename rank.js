const testFolder = 'data/spin/raw/100/';
const fs = require('fs');
files = fs.readdirSync(testFolder);

 files.forEach(file => {
	console.log(file);
});