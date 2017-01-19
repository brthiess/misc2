const fs = require('fs');
var heads_up_players = JSON.parse(fs.readFileSync('bin/top_heads_up_players.json', 'utf8'));
var threemax_players = JSON.parse(fs.readFileSync('bin/top_3max_players.json', 'utf8'));


function compare(a,b) {
  if (((a.chipsDifferential / a.numGames) * Math.log(a.numGames)) < ((b.chipsDifferential / b.numGames) * Math.log(b.numGames)))
    return -1;
  else 
    return 1;
  return 0;
}

heads_up_players.sort(compare);
threemax_players.sort(compare);

console.log(threemax_players);