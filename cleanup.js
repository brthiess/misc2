const dataFolder = 'data/spin/raw/100/';
const fs = require('fs');
files = fs.readdirSync(dataFolder);

 files.forEach(file => {
	if(file.includes("hh.com") && file.includes(".txt")){
		console.log(dataFolder + file);
		cleanFile(dataFolder + file);	
	}
});


function cleanFile(data) {
	//Remove Duplicates
	handNumbers = [];
	gameNumbers = [];
	refinedString = '';
	keepAdding = true;
	badUsernames = [];
	goodUsernames = [];
	previousGame = '';
	foundNewGameText = false;
	fs.readFileSync(data).toString().split('\n').forEach(function (line) {
		if (line.includes('PokerStars Hand #')) {
			if(handNumbers[line.split(" ")[2]] !== undefined){
				keepAdding = false;
				console.log(line.split(" ")[2]);
			}
			else {
				keepAdding = true;
				handNumbers[line.split(" ")[2]] = true;
			}
			previousGame = line.split(" ")[4];
			foundNewGameText = false;
		}
		if(keepAdding == true){
			for(var i = 0; i < badUsernames.length; i++){
				if(line.includes(badUsernames[i].trim())){
					line = line.replace(badUsernames[i].trim(), goodUsernames[i]);
				}
			}
			if((line.includes('Seat ') && line.includes('in chips)') && line.split(' ').length > 7 && !line.includes('is sitting out')) || (line.includes('Seat ') && line.includes('in chips)') && line.split(' ').length > 9 && line.includes('is sitting out'))){
				lineSplit = line.split(' ');
				//console.log(line);
				numberRegEx = /\([0-9]{1,3}/;
				endOfUsername = false;
				var newLine = '';	
				goodUsername = '';
				badUsername = '';
				for(var i = 0; i < lineSplit.length; i++){
					if(numberRegEx.test(lineSplit[i])){
						endOfUsername = true;
					}
					if (i <= 1){
						newLine += lineSplit[i] + ' ';
					}
					else if(!endOfUsername){
						newLine += lineSplit[i];
						goodUsername += lineSplit[i];
						badUsername += lineSplit[i] + ' ';
					}
					else {
						newLine += ' ' + lineSplit[i];
					}
					
				}
				//console.log(userName);
				badUsernames.push(badUsername);
				goodUsernames.push(goodUsername);
				console.log(goodUsername);
				console.log(badUsername);
				line = newLine;
			}
			//for(
			refinedString += line + '\n';
			//console.log(refinedString);
		}
		
	});
	fs.writeFileSync(data, refinedString);
}


