const adoorable: Level = {
  name: `adoorable`,
  rooms: [{
    type: `mcguffin`,
    x: 3,
    y: 3
  }, {
    type: `empty`,
    x: 5,
    y: 3
  }, {
    type: `switch`,
    x: 5,
    y: 2
  }, {
    type: `empty`,
    x: 4,
    y: 3
  }],
  corridors: [{
    type: `empty`,
    x: 5,
    y: 3,
    facing: `north`
  }, {
    type: `empty`,
    x: 4,
    y: 3,
    facing: `west`
  }, {
    type: `closedDoor`,
    x: 5,
    y: 3,
    facing: `west`
  }, {
    type: `goal`,
    x: 5,
    y: 3,
    facing: `east`
  }]
}
