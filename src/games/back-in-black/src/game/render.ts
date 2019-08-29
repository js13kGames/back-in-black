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
        delete mode.animation
        enterGameMode(mode.level + 1)
      }
    }, {
      label: `retry`,
      callback(): void {
        delete mode.animation
        enterGameMode(mode.level)
      }
    }, {
      label: `level select`,
      callback(): void {
        delete mode.animation
        enterMode({
          type: `levelSelect`
        })
      }
    }]
  }
}

function renderNonInteractiveGame(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
): () => void {
  const level = levels[mode.level]

  if (mode.state == `won` && !mode.animation) {
    renderNonInteractiveMenu(parent, postGameMenu(mode), false)
    return () => { }
  } else {
    const levelName = group(parent)
    translateY(levelName, 15 - halfSafeAreaHeightVirtualPixels)
    write(levelName, level.name)

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

    const mcguffinRoomGroupAndSprites: EngineAnimation[] = []

    if (mode.state == `initial` || mode.animation == `take`) {
      const switchState = mode.switch == (mode.animation == `switch` ? `b` : `a`)

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
            mcguffinRoomGroupAndSprites.push(roomGroup, sprite(roomGroup, game_room_mcguffin_a_svg))
            break
          case `switch`:
            changeOnSwitch.push({
              parent: roomGroup,
              hide: sprite(
                roomGroup,
                switchState ? game_room_switch_a_svg : game_room_switch_b_svg
              ),
              show: switchState ? game_room_switch_b_svg : game_room_switch_a_svg,
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
                switchState ? game_corridor_door_open_svg : game_corridor_door_closed_svg
              ),
              show: switchState ? game_corridor_door_closed_svg : game_corridor_door_open_svg,
            })
            break
          case `closedDoor`:
            changeOnSwitch.push({
              parent: corridorGroup,
              hide: sprite(
                corridorGroup,
                switchState ? game_corridor_door_closed_svg : game_corridor_door_open_svg
              ),
              show: switchState ? game_corridor_door_open_svg : game_corridor_door_closed_svg,
            })
            break
          case `goal`:
            sprite(corridorGroup, game_corridor_goal_closed_svg)
            break
          default:
            throw null
        }
      }
    }

    const playerGroup = group(parent)
    translate(playerGroup, mode.x * roomSpacing, mode.y * roomSpacing)
    rotate(playerGroup, facingDegrees[mode.facing])

    const idleInDark = mode.state != `initial`

    const playerIdleA = sprite(playerGroup, idleInDark ? game_player_idle_a_silhouette_svg : game_player_idle_a_lit_svg)
    const playerIdleB = sprite(playerGroup, idleInDark ? game_player_idle_b_silhouette_svg : game_player_idle_b_lit_svg)
    const playerWalk = sprite(playerGroup, idleInDark && mode.animation != `take` ? game_player_walk_silhouette_svg : game_player_walk_lit_svg)

    hide(playerIdleB)

    if (mode.animation) {
      hide(playerIdleA)
      translateX(playerGroup, -roomSpacing)
    } else {
      hide(playerWalk)
    }

    return () => {
      if (mode.animation) {
        linear(playerGroup)
        for (let i = 0; i < 8; i++) {
          elapse(50)
          scaleY(playerWalk, -1)
        }
        translateX(playerGroup, roomSpacing)
        hide(playerWalk)
        show(playerIdleA)
      }

      switch (mode.animation) {
        case `take`:
          while (hideWhenTaken.length) {
            let shortestDistance = Infinity
            for (const item of hideWhenTaken) {
              if (item.distance < shortestDistance) {
                shortestDistance = item.distance
              }
            }
            for (let index = 0; index < hideWhenTaken.length;) {
              const item = hideWhenTaken[index]
              if (item.distance == shortestDistance) {
                hide(item.hide)
                hideWhenTaken.splice(index, 1)
              } else {
                index++
              }
            }
            elapse(300)
          }
          break

        case `switch`:
          for (const change of changeOnSwitch) {
            hide(change.hide)
            sprite(change.parent, change.show)
          }
          break
      }

      if (mode.state == `won`) {
        hide(playerGroup)
        renderNonInteractiveMenu(parent, postGameMenu(mode), true)
        phase()
      } else {
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

        phase()

        elapse(333)
        if (mcguffinRoomGroupAndSprites.length) {
          hide(mcguffinRoomGroupAndSprites[1])
          mcguffinRoomGroupAndSprites.push(sprite(mcguffinRoomGroupAndSprites[0], game_room_mcguffin_b_svg))
        }
        elapse(147)
        hide(playerIdleA)
        show(playerIdleB)
        elapse(147)
        if (mcguffinRoomGroupAndSprites.length) {
          hide(mcguffinRoomGroupAndSprites[2])
          sprite(mcguffinRoomGroupAndSprites[0], game_room_mcguffin_c_svg)
        }
        elapse(333)
      }
    }
  }
}

function renderInteractiveGame(
  mainViewport: EngineViewport,
  mode: GameMode,
): void {
  mainViewport
  if (mode.state == `won`) {
    renderInteractiveMenu(mainViewport, postGameMenu(mode))
  } else {
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
        delete mode.animation

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
                mode.state = `won`
                break
            }

            mode.x += facingX[key.facing]
            mode.y += facingY[key.facing]

            for (const room of level.rooms) {
              if (room.x == mode.x && room.y == mode.y) {
                switch (room.type) {
                  case `mcguffin`:
                    if (mode.state == `initial`) {
                      mode.animation = `take`
                      mode.state = `taken`
                      return
                    }
                    break

                  case `switch`:
                    mode.animation = `switch`
                    mode.switch = mode.switch == `a` ? `b` : `a`
                    return
                }
                break
              }
            }
            mode.animation = `walk`
            return
          }
        }
      }
    }
  }
}
