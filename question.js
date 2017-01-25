'use strict';


readFile('asdf');


function readFile(data){
	//var lines = fs.readFileSync(data).toString().split('\n');

	for(var k = 0; k < 6000000000; k++){
		console.log('asdfasdkljfhaslkdfhalskjdfhadskljfhkdfhalskjdfhadskljfhkdfhalskjdfhadskljfhkdfhalskjdfhadskljfh');
	}
	//console.log(lines);
	return;
}

function readFileAsync(data){
	fs.readFile(data, function(err, data) {
		data.toString().split('\n').forEach(function (line) {
			console.log(line);
		});
	});
}
