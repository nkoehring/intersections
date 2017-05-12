export const MAX_PLAYERS = 4
export const PLAYER_COLORS = ['#06F', '#0F6', '#F60', '#60F']
const CITADEL_ODDS = 0.2
const INITIAL_POWER = 50
const STANDARD_VOLUME = 5
const EXTENDED_VOLUME = 20
const EXTENDED_VOLUME_DECAY_MULTIPLIER = 0.5
const CITADEL_MODEL = {
  value: 0,
  volume: STANDARD_VOLUME,
  maxOverload: EXTENDED_VOLUME,
  selected: false,
  highlighted: false,
  owner: null
}

export const neighbours = function neighbours (i, columns, citadels) {
  const notLeftCorner = i % columns !== 0
  const notRightCorner = (i+1) % columns !== 0

  let result = [
    notLeftCorner && i - 1,            // left
    notRightCorner && i + 1,           // right
    i - columns,                       // above middle
    notLeftCorner && i - columns - 1,  // above left
    notRightCorner && i - columns + 1, // above right
    i + columns,                       // below middle
    notLeftCorner && i + columns - 1,  // below left
    notRightCorner && i + columns + 1  // below right
  ]
  return result.filter(n => 0 !== false && citadels[n])
}

export const populateField = function populateField (rows, columns, players) {
  const n = rows * columns
  let i;
  let citadels = new Array(n)
  let playerPositions = [0, n - 1, n - columns, columns - 1].sort(() => 0.5 - Math.random())
  playerPositions.length = players

  for(i = 0; i < n; i++)
    if (playerPositions.indexOf(i) >= 0 || Math.random() > CITADEL_ODDS)
      citadels[i] = Object.assign({}, CITADEL_MODEL)

  // put players
  for(i = 0; i < players; i++) {
    let pos = playerPositions[i]
    citadels[pos].owner = i
    citadels[pos].value = INITIAL_POWER
  }

  return citadels
}

export const conquer = function conquer (source, target) {
  if (target.owner === source.owner || source.value <= 1) return

  const diff = source.value - target.value

  if (diff > 0) {
    target.value = diff - 1
    if (target.value < 1) target.value = 1
    source.value = 1
    target.owner = source.owner

  } else if (diff < 0) {
    target.value = (diff - 1) * -1
    if (target.value < 1) target.value = 1
    source.value = 1

  } else {
    const chance = Math.random()
    target.value = 1
    source.value = 1
    if (target.owner === null || chance >= 0.5)
      target.owner = source.owner
  }
}
