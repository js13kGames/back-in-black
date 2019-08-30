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

function renderCorridor(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  corridor: Corridor,
): EngineAnimation {
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
  return corridorSprite
}

function renderCorridors(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  level: Level,
): void {
  for (const corridor of level.corridors) {
    renderCorridor(parent, mode, corridor)
  }
}

function animateWalk(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  level: Level,
  svg: EngineSpritesSvg,
): () => undefined | (() => void) {
  const playerGroup = group(parent)
  translate(playerGroup, mode.x * roomSpacing, mode.y * roomSpacing)
  rotate(playerGroup, facingDegrees[mode.facing])
  const playerSprite = sprite(playerGroup, svg)
  return () => {
    linear(playerGroup)
    for (let i = 0; i < 2; i++) {
      elapse(100)
      scaleY(playerSprite, -1)
      elapse(100)
      scaleY(playerSprite, -1)
    }
    translateX(playerGroup, roomSpacing)
    return () => {
      mode.x += facingX[mode.facing]
      mode.y += facingY[mode.facing]
      mode.walking = false

      if (mode.state == `initial` && mode.x == level.mcguffin[0] && mode.y == level.mcguffin[1]) {
        mode.state = `taking`
        return
      }

      for (const room of level.switches) {
        if (mode.x == room[0] && mode.y == room[1]) {
          mode.switch = mode.switch == `a` ? `b` : `a`
          return
        }
      }

      for (const room of level.rooms) {
        if (mode.x == room[0] && mode.y == room[1]) {
          return
        }
      }

      mode.state = `won`
    }
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

      if (mode.walking) {
        return animateWalk(parent, mode, level, game_player_walk_lit_svg)
      } else {
        const playerGroup = group(parent)
        translate(playerGroup, mode.x * roomSpacing, mode.y * roomSpacing)
        rotate(playerGroup, facingDegrees[mode.facing])
        const playerA = sprite(playerGroup, game_player_idle_a_lit_svg)

        renderNonInteractiveKeys(parent, mode)

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
      }

    case `taking`:
      const toShutOff: {
        readonly sprite: EngineAnimation
        readonly distance: number
      }[] = []

      for (const room of level.rooms) {
        const roomSprite = sprite(parent, game_room_empty_svg)
        translate(roomSprite, room[0] * roomSpacing, room[1] * roomSpacing)
        toShutOff.push({
          sprite: roomSprite,
          distance: distanceSquared(room[0], room[1], level.mcguffin[0], level.mcguffin[1]),
        })
      }

      for (const room of level.switches) {
        const roomSprite = sprite(parent, mode.switch == `a` ? game_room_switch_a_svg : game_room_switch_b_svg)
        translate(roomSprite, room[0] * roomSpacing, room[1] * roomSpacing)
        toShutOff.push({
          sprite: roomSprite,
          distance: distanceSquared(room[0], room[1], level.mcguffin[0], level.mcguffin[1]),
        })
      }

      for (const corridor of level.corridors) {
        toShutOff.push({
          sprite: renderCorridor(parent, mode, corridor),
          distance: Math.min(
            distanceSquared(
              corridor.x,
              corridor.y,
              level.mcguffin[0],
              level.mcguffin[1],
            ),
            distanceSquared(
              corridor.x + facingX[corridor.facing],
              corridor.y + facingY[corridor.facing],
              level.mcguffin[0],
              level.mcguffin[1],
            )
          ),
        })
      }

      return () => {
        while (toShutOff.length) {
          let shortestDistance = Infinity
          for (const item of toShutOff) {
            if (item.distance < shortestDistance) {
              shortestDistance = item.distance
            }
          }
          for (let index = 0; index < toShutOff.length;) {
            const item = toShutOff[index]
            if (item.distance == shortestDistance) {
              hide(item.sprite)
              toShutOff.splice(index, 1)
            } else {
              index++
            }
          }
          elapse(300)
        }

        return () => mode.state = `taken`
      }

    default:
      return () => { return undefined }
  }
}

function renderInteractiveGame(
  mainViewport: EngineViewport,
  mode: GameMode,
): void {
  if (shouldRenderKeys(mode)) {
    for (const key of keys) {
      mapKey(key.keycode, callback)
      hitbox(
        mainViewport,
        halfSafeAreaWidthVirtualPixels + key.x * 32,
        halfSafeAreaHeightVirtualPixels + key.y * 32,
        32, 32,
        callback
      )

      function callback() {
        const level = levels[mode.level]

        mode.facing = key.facing
        mode.walking = false

        for (const corridor of level.corridors) {
          const forward = corridor.x == mode.x && corridor.y == mode.y && corridor.facing == key.facing
          const otherEndX = corridor.x + facingX[corridor.facing]
          const otherEndY = corridor.y + facingY[corridor.facing]
          const otherFacing = facingReverse[corridor.facing]
          const reverse = otherEndX == mode.x && otherEndY == mode.y && otherFacing == key.facing

          if (forward || reverse) {
            switch (corridor.type) {
              case `ledge`:
                if (reverse) {
                  return
                }
                break

              case `openDoor`:
                if (mode.switch == `b`) {
                  return
                }
                break

              case `closedDoor`:
                if (mode.switch == `a`) {
                  return
                }
                break

              case `goal`:
                if (mode.state == `initial`) {
                  return
                }
                break
            }

            mode.walking = true
            return
          }
        }
      }
    }
  }
}

function shouldRenderKeys(
  mode: GameMode,
): Truthiness {
  if (mode.state == `initial` || mode.state == `taken` && !mode.walking) {
    return 1
  }
  return
}

function renderNonInteractiveKeys(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
): void {
  if (shouldRenderKeys(mode)) {
    for (const key of keys) {
      const keyGroup = group(parent)
      translate(
        keyGroup,
        halfSafeAreaWidthVirtualPixels + key.x * 32 + 16,
        halfSafeAreaHeightVirtualPixels + key.y * 32 + 16
      )
      sprite(keyGroup, game_hud_key_svg)
      write(keyGroup, key.text)
    }
  }
}
