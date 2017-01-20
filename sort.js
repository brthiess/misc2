const fs = require('fs');
var heads_up_players = JSON.parse(fs.readFileSync('bin/top_heads_up_players.json', 'utf8'));
var threemax_players = JSON.parse(fs.readFileSync('bin/top_3max_players.json', 'utf8'));


function compare(a,b) {
  if (((a.chipsDifferential / a.numGames) * (Math.sqrt(a.numGames) - 1)) < ((b.chipsDifferential / b.numGames) * (Math.sqrt(b.numGames) - 1)))
    return -1;
  else 
    return 1;
  return 0;
}

heads_up_players.sort(compare);
threemax_players.sort(compare);


var players_2_json = JSON.stringify(heads_up_players);
var players_3_json = JSON.stringify(threemax_players);

fs.writeFile("bin/top_heads_up_players.json", players_2_json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
fs.writeFile("bin/top_3max_players.json", players_3_json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});