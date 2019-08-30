const keys: ReadonlyArray<{
  readonly facing: Facing
  readonly keycode: KeyCode
  readonly text: string
  readonly x: number
  readonly y: number
}> = [{
  facing: `north`,
  keycode: `KeyW`,
  text: `w`,
  x: -2,
  y: -2,
}, {
  facing: `east`,
  keycode: `KeyD`,
  text: `d`,
  x: -1,
  y: -1,
}, {
  facing: `south`,
  keycode: `KeyS`,
  text: `s`,
  x: -2,
  y: -1,
}, {
  facing: `west`,
  keycode: `KeyA`,
  text: `a`,
  x: -3,
  y: -1,
}]

function postGameMenu(
  mode: GameMode,
): Menu {
  return {
    title: `nice job`,
    options: [{
      label: `next`,
      callback(): void {
        mode.walking = false
        enterGameMode(mode.level + 1)
      }
    }, {
      label: `retry`,
      callback(): void {
        mode.walking = false
        enterGameMode(mode.level)
      }
    }, {
      label: `level select`,
      callback(): void {
        mode.walking = false
        enterMode({
          type: `levelSelect`
        })
      }
    }]
  }
}

function renderStaticRooms(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  level: Level,
): void {
  for (const room of level.rooms) {
    translate(sprite(parent, game_room_empty_svg), room[0] * roomSpacing, room[1] * roomSpacing)
  }
  for (const room of level.switches) {
    translate(sprite(parent, mode.switch == `a` ? game_room_switch_a_svg : game_room_switch_b_svg), room[0] * roomSpacing, room[1] * roomSpacing)
  }
}

function renderCorridors(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  level: Level,
): void {
  for (const corridor of level.corridors) {
    let svg: EngineSpritesSvg

    switch (corridor.type) {
      case `empty`:
        svg = game_corridor_empty_svg
        break

      case `ledge`:
        svg = game_corridor_ledge_svg
        break

      case `stairs`:
        svg = game_corridor_stairs_svg
        break

      case `openDoor`:
        svg = mode.switch == `a` ? game_corridor_door_open_svg : game_corridor_door_closed_svg
        break

      case `closedDoor`:
        svg = mode.switch == `a` ? game_corridor_door_closed_svg : game_corridor_door_open_svg
        break

      case `goal`:
        svg = game_corridor_goal_closed_svg
        break

      default:
        // TODO: this is impossible.
        throw null
    }

    const corridorSprite = sprite(parent, svg)
    translate(corridorSprite, corridor.x * roomSpacing, corridor.y * roomSpacing)
    rotate(corridorSprite, facingDegrees[corridor.facing])
  }
}

function renderNonInteractiveGame(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
): () => (undefined | (() => void)) {
  const level = levels[mode.level]
  switch (mode.state) {
    case `initial`:
      renderStaticRooms(parent, mode, level)

      const mcguffinGroup = group(parent)
      translate(mcguffinGroup, level.mcguffin[0] * roomSpacing, level.mcguffin[1] * roomSpacing)
      const mcguffinA = sprite(mcguffinGroup, game_room_mcguffin_a_svg)

      renderCorridors(parent, mode, level)

      const playerGroup = group(parent)
      translate(playerGroup, mode.x * roomSpacing, mode.y * roomSpacing)
      rotate(playerGroup, facingDegrees[mode.facing])
      const playerA = sprite(playerGroup, game_player_idle_a_lit_svg)

      return () => {
        elapse(333)
        hide(mcguffinA)
        const mcguffinB = sprite(mcguffinGroup, game_room_mcguffin_b_svg)
        elapse(167)
        hide(playerA)
        sprite(playerGroup, game_player_idle_b_lit_svg)
        elapse(167)
        hide(mcguffinB)
        sprite(mcguffinGroup, game_room_mcguffin_c_svg)
        elapse(333)
        return undefined
      }

    default:
      return () => { return undefined }
  }
}

function renderInteractiveGame(
  mainViewport: EngineViewport,
  mode: GameMode,
): void {
  mainViewport
  mode
}
