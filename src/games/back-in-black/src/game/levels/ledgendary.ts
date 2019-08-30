const ledgendary: Level = {
  name: `ledgendary`,
  mcguffin: [-1, 0],
  switches: [],
  rooms: [
    [0, 0],
    [0, -1],
    [1, -1],
    [0, 1],
    [1, 1],
    [1, 0]
  ],
  goal: [1, 0, `east`],
  ledges: [
    [1, -1, `west`],
    [0, 1, `east`],
  ],
  stairs: [],
  openDoors: [],
  closedDoors: [],
  corridors: [
    [-1, 0, `east`],
    [0, 0, `north`],
    [1, 0, `north`],
    [0, 0, `south`],
    [1, 0, `south`],
  ],
}
