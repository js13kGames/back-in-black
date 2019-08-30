const adoorable: Level = {
  name: `adoorable`,
  mcguffin: [-1, 0],
  rooms: [{
    type: `empty`,
    x: 1,
    y: 0
  }, {
    type: `switch`,
    x: 1,
    y: -1
  }, {
    type: `empty`,
    x: 0,
    y: 0
  }],
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
