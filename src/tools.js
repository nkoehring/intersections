const CITADEL_ODDS = 0.2
const MAX_PLAYERS = 4

export const populateField = function populateField (rows, columns, players) {
  const n = rows * columns
  let i;
  let citadels = new Array(n)
  let connections = []
  let playerPositions = [0, n - 1, n - columns, columns - 1].sort(() => 0.5 - Math.random())
  playerPositions.length = players

  for(i = 0; i < n; i++)
    if (playerPositions.indexOf(i) >= 0 || Math.random() > CITADEL_ODDS)
      citadels[i] = { value:0, selected:false, owner:null }

  // put players
  for(i = 0; i < players; i++) {
    let pos = playerPositions[i]
    citadels[pos].owner = i
    citadels[pos].value = 1
  }

  return citadels
}
