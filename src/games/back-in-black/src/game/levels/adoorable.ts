const adoorable: Level = {
  name: `adoorable`,
  mcguffin: [-1, 0],
  switches: [
    [1, -1]
  ],
  rooms: [
    [1, 0],
    [0, 0]
  ],
  corridors: [{
    type: `empty`,
    x: 1,
    y: 0,
    facing: `north`
  }, {
    type: `empty`,
    x: 0,
    y: 0,
    facing: `west`
  }, {
    type: `closedDoor`,
    x: 1,
    y: 0,
    facing: `west`
  }, {
    type: `goal`,
    x: 1,
    y: 0,
    facing: `east`
  }]
}
