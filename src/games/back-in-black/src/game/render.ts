function renderNonInteractiveGame(
  parent: EngineViewport | EngineAnimation,
  gamePhase: GamePhase,
): () => void {
  const level = levels[gamePhase.level]

  let mcguffinX = 0
  let mcguffinY = 0
  for (const room of level.rooms) {
    if (room.type == `mcguffin`) {
      mcguffinX = room.x
      mcguffinY = room.y
      break
    }
  }

  const changeOnSwitch: {
    readonly parent: EngineAnimation
    readonly hide: EngineAnimation
    readonly show: EngineSpritesSvg
  }[] = []

  const hideWhenTaken: {
    readonly hide: EngineAnimation
    readonly distance: number
  }[] = []

  for (const room of level.rooms) {
    const roomGroup = group(parent)
    translate(roomGroup, room.x * roomSpacing, room.y * roomSpacing)
    hideWhenTaken.push({
      hide: roomGroup,
      distance: distanceSquared(room.x, room.y, mcguffinX, mcguffinY),
    })

    switch (room.type) {
      case `empty`: {
        sprite(roomGroup, game_room_empty_svg)
      } break
      case `mcguffin`:
        sprite(roomGroup, game_room_mcguffin_a_svg)
        break
      case `switch`:
        changeOnSwitch.push({
          parent: roomGroup,
          hide: sprite(
            roomGroup,
            gamePhase.switch == `a` ? game_room_switch_a_svg : game_room_switch_b_svg
          ),
          show: gamePhase.switch == `a` ? game_room_switch_b_svg : game_room_switch_a_svg,
        })
        break
      default:
        throw null
    }
  }

  for (const corridor of level.corridors) {
    const corridorGroup = group(parent)
    translate(corridorGroup, corridor.x * roomSpacing, corridor.y * roomSpacing)
    rotate(corridorGroup, facingDegrees[corridor.facing])
    hideWhenTaken.push({
      hide: corridorGroup,
      distance: Math.min(
        distanceSquared(corridor.x, corridor.y, mcguffinX, mcguffinY),
        distanceSquared(corridor.x + facingX[corridor.facing], corridor.y + facingY[corridor.facing], mcguffinX, mcguffinY)
      )
    })

    switch (corridor.type) {
      case `empty`:
        sprite(corridorGroup, game_corridor_empty_svg)
        break
      case `ledge`:
        sprite(corridorGroup, game_corridor_ledge_svg)
        break
      case `stairs`:
        sprite(corridorGroup, game_corridor_stairs_svg)
        break
      case `openDoor`:
        changeOnSwitch.push({
          parent: corridorGroup,
          hide: sprite(
            corridorGroup,
            gamePhase.switch == `a` ? game_corridor_door_open_svg : game_corridor_door_closed_svg
          ),
          show: gamePhase.switch == `a` ? game_corridor_door_closed_svg : game_corridor_door_open_svg,
        })
        break
      case `closedDoor`:
        changeOnSwitch.push({
          parent: corridorGroup,
          hide: sprite(
            corridorGroup,
            gamePhase.switch == `a` ? game_corridor_door_closed_svg : game_corridor_door_open_svg
          ),
          show: gamePhase.switch == `a` ? game_corridor_door_open_svg : game_corridor_door_closed_svg,
        })
        break
      case `goal`:
        sprite(corridorGroup, game_corridor_goal_closed_svg)
        break
      default:
        throw null
    }
  }

  return phase
}

function renderInteractiveGame(
  mainViewport: EngineViewport,
  gamePhase: GamePhase,
): void {
  mainViewport
  gamePhase
}
