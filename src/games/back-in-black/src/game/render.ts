function renderGame(gamePhase: GamePhase): void {
  draw(background_game_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
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

  const shutdownRate = 0.4

  for (const room of level.rooms) {
    const shutsOff = gamePhase.taken === undefined
      ? undefined
      : gamePhase.taken + Math.pow(distance(mcguffinX, mcguffinY, room.x, room.y), shutdownRate)

    until(shutsOff, () => {
      const transforms = [
        translate(room.x * roomSpacing, room.y * roomSpacing)
      ]
      switch (room.type) {
        case `empty`:
          draw(room_empty_svg, transforms)
          break
        case `switch`:
          draw(gamePhase.switch ? room_switch_a_svg : room_switch_b_svg, transforms)
          break
        case `mcguffin`:
          draw(room_mcguffin_svg, transforms)
          break
      }
    })
  }

  for (const corridor of level.corridors) {
    const transforms = [
      translate(corridor.x * roomSpacing, corridor.y * roomSpacing),
      rotate(facingDegrees[corridor.facing])
    ]

    const shutsOff = gamePhase.taken === undefined
      ? undefined
      : gamePhase.taken + Math.min(
        Math.pow(distance(mcguffinX, mcguffinY, corridor.x, corridor.y), shutdownRate),
        Math.pow(distance(mcguffinX, mcguffinY, corridor.x + facingX[corridor.facing], corridor.y + facingY[corridor.facing]), shutdownRate)
      )

    if (corridor.type == `goal`) {
      switchAt(
        shutsOff,
        () => draw(corridor_goal_closed_svg, transforms),
        () => draw(corridor_goal_open_svg, transforms)
      )
    } else {
      until(
        shutsOff,
        () => {
          switch (corridor.type) {
            case `empty`:
              draw(corridor_empty_svg, transforms)
              break
            case `ledge`:
              draw(corridor_ledge_svg, transforms)
              break
            case `stairs`:
              draw(corridor_stairs_svg, transforms)
              break
            case `openDoor`:
              draw(gamePhase.switch == `a` ? corridor_door_open_svg : corridor_door_closed_svg, transforms)
              break
            case `closedDoor`:
              draw(gamePhase.switch == `b` ? corridor_door_open_svg : corridor_door_closed_svg, transforms)
              break
          }
        }
      )
    }
  }

  const steps = 8
  const walkDuration = 1

  until(gamePhase.taken, () => {
    iterativeAnimation(
      gamePhase.startedWalking,
      walkDuration / steps,
      steps,
      i => draw(
        player_walk_svg,
        [
          translate(
            (gamePhase.x - facingX[gamePhase.facing] * (steps - i) / steps) * roomSpacing,
            (gamePhase.y - facingY[gamePhase.facing] * (steps - i) / steps) * roomSpacing
          ),
          rotate(facingDegrees[gamePhase.facing]),
          scaleY(i % 2 ? 1 : -1)
        ]),
      () => draw(player_idle_svg, [translate(gamePhase.x * roomSpacing, gamePhase.y * roomSpacing), rotate(facingDegrees[gamePhase.facing])])
    )
  })

  const keySpacing = 34
  function key(x: number, y: number, label: string, facing: Facing): void {
    x -= 0.5
    y -= 0.5
    const transforms = [translate(safeAreaWidthVirtualPixels - keySpacing * x, safeAreaHeightVirtualPixels - keySpacing * y)]
    draw(hud_key_svg, transforms)
    draw(font[label], transforms)
    hitbox(keySpacing, keySpacing, transforms, () => {
      let canPass = false
      for (const corridor of level.corridors) {
        const atOrigin = corridor.facing == facing
          && corridor.x == gamePhase.x
          && corridor.y == gamePhase.y
        const destinationX = corridor.x + facingX[corridor.facing]
        const destinationY = corridor.y + facingY[corridor.facing]
        const atDestination = facingReverse[corridor.facing] == facing
          && destinationX == gamePhase.x
          && destinationY == gamePhase.y
        if (!atOrigin && !atDestination) {
          continue
        }
        switch (corridor.type) {
          case `empty`:
          case `stairs`:
            canPass = true
            break

          case `ledge`:
            canPass = atOrigin
            break

          case `openDoor`:
            canPass = gamePhase.switch == `a`
            break

          case `closedDoor`:
            canPass = gamePhase.switch == `b`
            break

          case `goal`:
            canPass = gamePhase.taken != null
            break
        }
        break
      }

      gamePhase.facing = facing

      if (canPass) {
        gamePhase.x += facingX[facing]
        gamePhase.y += facingY[facing]
        gamePhase.startedWalking = now

        for (const room of level.rooms) {
          if (room.x == gamePhase.x && room.y == gamePhase.y) {
            switch (room.type) {
              case `switch`:
                gamePhase.switch = gamePhase.switch == `a`
                  ? `b`
                  : `a`
                break
              case `mcguffin`:
                if (gamePhase.taken == null) {
                  gamePhase.taken = now + walkDuration
                }
                break
            }
            break
          }
        }
      }
    })
  }
  key(1, 1, `d`, `east`)
  key(2, 1, `s`, `south`)
  key(2, 2, `w`, `north`)
  key(3, 1, `a`, `west`)

  const glyphWidth = 16
  const glyphHeight = 32

  function write(x: number, y: number, text: string): void {
    x -= (text.length - 1) * glyphWidth / 2
    for (let i = 0; i < text.length; i++) {
      const character = text.charAt(i)
      if (character != ` `) {
        draw(font[character], [translate(x, y)])
      }
      x += glyphWidth
    }
  }

  write(halfSafeAreaWidthVirtualPixels, glyphHeight / 2, level.name)
}
