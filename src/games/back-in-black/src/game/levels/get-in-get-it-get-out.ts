const getInGetItGetOut: Level = {
  name: `get in,get it,get out`,
  rooms: [{
    type: `mcguffin`,
    x: 3,
    y: 2
  }, {
    type: `empty`,
    x: 4,
    y: 2
  }, {
    type: `empty`,
    x: 4,
    y: 3
  }, {
    type: `empty`,
    x: 4,
    y: 4
  }, {
    type: `empty`,
    x: 5,
    y: 4
  }],
  corridors: [{
    type: `empty`,
    x: 3,
    y: 2,
    facing: `east`
  }, {
    type: `empty`,
    x: 4,
    y: 2,
    facing: `south`
  }, {
    type: `empty`,
    x: 4,
    y: 3,
    facing: `south`
  }, {
    type: `empty`,
    x: 4,
    y: 4,
    facing: `east`
  }, {
    type: `goal`,
    x: 5,
    y: 4,
    facing: `east`
  }]
}
