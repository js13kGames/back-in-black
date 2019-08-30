const getInGetItGetOut: Level = {
  name: `get in,get it,get out`,
  mcguffin: [-1, -1],
  switches: [],
  rooms: [{
    type: `empty`,
    x: 0,
    y: -1
  }, {
    type: `empty`,
    x: 0,
    y: 0
  }, {
    type: `empty`,
    x: 0,
    y: 1
  }, {
    type: `empty`,
    x: 1,
    y: 1
  }],
  corridors: [{
    type: `empty`,
    x: -1,
    y: -1,
    facing: `east`
  }, {
    type: `empty`,
    x: 0,
    y: -1,
    facing: `south`
  }, {
    type: `empty`,
    x: 0,
    y: 0,
    facing: `south`
  }, {
    type: `empty`,
    x: 0,
    y: 1,
    facing: `east`
  }, {
    type: `goal`,
    x: 1,
    y: 1,
    facing: `east`
  }]
}
