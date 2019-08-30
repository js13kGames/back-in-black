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

function translateLikeRoom(
  likeRoom: {
    readonly 0: number
    readonly 1: number
  },
  object: EngineAnimation,
): void {
  translate(object, likeRoom[0] * roomSpacing, likeRoom[1] * roomSpacing)
}

function translateAndRotateLikeCorridor(
  likeCorridor: {
    readonly 0: number
    readonly 1: number
    readonly 2: Facing
  },
  object: EngineAnimation
): void {
  translateLikeRoom(likeCorridor, object)
  rotate(object, facingDegrees[likeCorridor[2]])
}

function postGameMenu(
  mode: GameMode,
): Menu {
  return {
    title: `nice job`,
    options: [{
      label: `next`,
      callback(): void {
        if (mode.level == levels.length - 1) {
          enterMode({
            type: `credits`
          })
        } else {
          enterGameMode(mode.level + 1)
        }
      }
    }, {
      label: `retry`,
      callback(): void {
        enterGameMode(mode.level)
      }
    }, {
      label: `level select`,
      callback(): void {
        enterMode({
          type: `levelSelect`
        })
      }
    }]
  }
}

function forEachRoom(
  mode: GameMode,
  level: Level,
  callback: (
    room: readonly [number, number],
    svg: EngineSpritesSvg,
  ) => void,
): void {
  for (const room of level.rooms) {
    callback(room, game_room_empty_svg)
  }
  for (const room of level.switches) {
    callback(room, mode.switch == `a` ? game_room_switch_a_svg : game_room_switch_b_svg)
  }
}

function forEachRoomRendered(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  level: Level,
  callback: (
    room: readonly [number, number],
    sprite: EngineAnimation,
  ) => void
): void {
  forEachRoom(mode, level, (room, svg) => {
    const roomSprite = sprite(parent, svg)
    translateLikeRoom(room, roomSprite)
    callback(room, roomSprite)
  })
}

function forEachCorridor(
  mode: GameMode,
  level: Level,
  callback: (
    corridor: Corridor,
    svg: EngineSpritesSvg,
  ) => void,
): void {
  callback(level.goal, game_corridor_goal_closed_svg)
  for (const ledge of level.ledges) {
    callback(ledge, game_corridor_ledge_svg)
  }
  for (const stair of level.stairs) {
    callback(stair, game_corridor_stairs_svg)
  }
  for (const door of level.openDoors) {
    callback(door, mode.switch == `a` ? game_corridor_door_open_svg : game_corridor_door_closed_svg)
  }
  for (const door of level.closedDoors) {
    callback(door, mode.switch == `a` ? game_corridor_door_closed_svg : game_corridor_door_open_svg)
  }
  for (const corridor of level.corridors) {
    callback(corridor, game_corridor_empty_svg)
  }
}


function forEachCorridorRendered(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  level: Level,
  callback: (
    corridor: Corridor,
    sprite: EngineAnimation,
  ) => void,
): void {
  forEachCorridor(mode, level, (corridor, svg) => {
    const corridorSprite = sprite(parent, svg)
    translateAndRotateLikeCorridor(corridor, corridorSprite)
    callback(corridor, corridorSprite)
  })
}

function animateWalk(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
  level: Level,
  svg: EngineSpritesSvg,
): () => undefined | (() => void) {
  if (mode.state == `entering`) {
    const goalSprite = sprite(parent, game_corridor_goal_open_floor_lit_svg)
    translateAndRotateLikeCorridor(level.goal, goalSprite)
  }

  if (mode.state == `taken`) {
    const goalSprite = sprite(parent, game_corridor_goal_open_floor_dark_svg)
    translateAndRotateLikeCorridor(level.goal, goalSprite)
  }

  const playerGroup = group(parent)
  translateAndRotateLikeCorridor(mode, playerGroup)

  if (mode.state == `entering`) {
    const goalSprite = sprite(parent, game_corridor_goal_open_ceiling_lit_svg)
    translateAndRotateLikeCorridor(level.goal, goalSprite)
  }

  if (mode.state == `taken`) {
    const goalSprite = sprite(parent, game_corridor_goal_open_ceiling_dark_svg)
    translateAndRotateLikeCorridor(level.goal, goalSprite)
  }

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
      mode[0] += facingX[mode[2]]
      mode[1] += facingY[mode[2]]
      mode.walking = false

      if (mode.state == `entering`) {
        mode.state = `finding`
      }

      if (mode[0] == level.mcguffin[0] && mode[1] == level.mcguffin[1]) {
        if (mode.state == `finding`) {
          mode.state = `taking`
        }
        return
      }

      for (const room of level.switches) {
        if (mode[0] == room[0] && mode[1] == room[1]) {
          mode.switch = mode.switch == `a` ? `b` : `a`
          return
        }
      }

      for (const room of level.rooms) {
        if (mode[0] == room[0] && mode[1] == room[1]) {
          return
        }
      }

      mode.state = `won`
      mode.menuState = `opening`
      state.unlockedLevels = Math.min(levels.length, Math.max(state.unlockedLevels, mode.level + 2))
    }
  }
}

function renderNonInteractiveGame(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
): () => (undefined | (() => void)) {
  const level = levels[mode.level]
  switch (mode.state) {
    case `entering`:
    case `finding`:
      forEachRoomRendered(parent, mode, level, () => { })

      const mcguffinGroup = group(parent)
      translateLikeRoom(level.mcguffin, mcguffinGroup)
      const mcguffinA = sprite(mcguffinGroup, game_room_mcguffin_a_svg)

      forEachCorridorRendered(parent, mode, level, () => { })

      if (mode.walking) {
        return animateWalk(parent, mode, level, game_player_walk_lit_svg)
      } else {
        const playerGroup = group(parent)
        translateAndRotateLikeCorridor(mode, playerGroup)
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

      forEachRoomRendered(parent, mode, level, (room, roomSprite) => toShutOff.push({
        sprite: roomSprite,
        distance: distanceSquared(room[0], room[1], level.mcguffin[0], level.mcguffin[1]),
      }))

      forEachCorridorRendered(parent, mode, level, (corridor, sprite) => toShutOff.push({
        sprite,
        distance: Math.min(
          distanceSquared(
            corridor[0],
            corridor[1],
            level.mcguffin[0],
            level.mcguffin[1],
          ),
          distanceSquared(
            corridor[0] + facingX[corridor[2]],
            corridor[1] + facingY[corridor[2]],
            level.mcguffin[0],
            level.mcguffin[1],
          )
        ),
      }))

      const playerSprite = sprite(parent, game_player_idle_a_silhouette_svg)
      translateAndRotateLikeCorridor(mode, playerSprite)

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

    case `taken`:
      if (mode.walking) {
        return animateWalk(parent, mode, level, game_player_walk_silhouette_svg)
      } else {
        const goalFloorSprite = sprite(parent, game_corridor_goal_open_floor_dark_svg)
        translateAndRotateLikeCorridor(level.goal, goalFloorSprite)
        const goalCeilingSprite = sprite(parent, game_corridor_goal_open_ceiling_dark_svg)
        translateAndRotateLikeCorridor(level.goal, goalCeilingSprite)

        const playerGroup = group(parent)
        translateAndRotateLikeCorridor(mode, playerGroup)
        const playerA = sprite(playerGroup, game_player_idle_a_silhouette_svg)

        renderNonInteractiveKeys(parent, mode)

        return () => {
          elapse(500)
          hide(playerA)
          sprite(playerGroup, game_player_idle_b_silhouette_svg)
          elapse(500)
          return undefined
        }
      }

    case `won`:
      if (mode.menuState == `opening`) {
        return () => {
          renderNonInteractiveMenu(parent, postGameMenu(mode), true)
          return () => mode.menuState = `open`
        }
      } else {
        renderNonInteractiveMenu(parent, postGameMenu(mode), false)
        return () => {
          return undefined
        }
      }

    default:
      return () => { return undefined }
  }
}

function travellingForward(
  mode: GameMode,
  corridor: Corridor,
): boolean {
  return mode[0] == corridor[0]
    && mode[1] == corridor[1]
    && mode[2] == corridor[2]
}

function travellingBackward(
  mode: GameMode,
  corridor: Corridor,
): boolean {
  return mode[0] == corridor[0] + facingX[corridor[2]]
    && mode[1] == corridor[1] + facingY[corridor[2]]
    && mode[2] == facingReverse[corridor[2]]
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

        mode[2] = key.facing
        mode.walking = false

        const passableInBothDirections = level.corridors
          .concat(level.stairs)
          .concat(mode.switch == `a` ? level.openDoors : level.closedDoors)
          .concat(mode.state == `taken` ? [level.goal] : [])

        for (const corridor of passableInBothDirections) {
          if (travellingForward(mode, corridor)
            || travellingBackward(mode, corridor)) {
            mode.walking = true
          }
        }

        for (const ledge of level.ledges) {
          if (travellingForward(mode, ledge)) {
            mode.walking = true
          }
        }
      }
    }
  }

  if (mode.state == `won`) {
    renderInteractiveMenu(mainViewport, postGameMenu(mode))
  }
}

function shouldRenderKeys(
  mode: GameMode,
): Truthiness {
  if ((mode.state == `finding` || mode.state == `taken`) && !mode.walking) {
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
      const left = sprite(keyGroup, game_hud_button_svg)
      translateX(left, -15)
      const right = sprite(keyGroup, game_hud_button_svg)
      translateX(right, 15)
      scaleX(right, -1)
      write(keyGroup, key.text)
    }
  }
}
