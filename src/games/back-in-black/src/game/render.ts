function renderGame(gamePhase: GamePhase): void {
  draw(game_background_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
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
          draw(game_room_empty_svg, transforms)
          break
        case `switch`:
          switchAt(
            gamePhase.switchChanged,
            () => draw(gamePhase.switch == 'b' ? game_room_switch_a_svg : game_room_switch_b_svg, transforms),
            () => draw(gamePhase.switch == 'a' ? game_room_switch_a_svg : game_room_switch_b_svg, transforms)
          )
          break
        case `mcguffin`:
          loop(state.started, [
            [0.25, () => draw(game_room_mcguffin_a_svg, transforms)],
            [0.25, () => draw(game_room_mcguffin_b_svg, transforms)],
            [0.25, () => draw(game_room_mcguffin_c_svg, transforms)]
          ])
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
        () => draw(game_corridor_goal_closed_svg, transforms),
        () => draw(game_corridor_goal_open_svg, transforms)
      )
    } else {
      until(
        shutsOff,
        () => {
          switch (corridor.type) {
            case `empty`:
              draw(game_corridor_empty_svg, transforms)
              break
            case `ledge`:
              draw(game_corridor_ledge_svg, transforms)
              break
            case `stairs`:
              draw(game_corridor_stairs_svg, transforms)
              break
            case `openDoor`:
              switchAt(
                gamePhase.switchChanged,
                () => draw(gamePhase.switch == `b` ? game_corridor_door_open_svg : game_corridor_door_closed_svg, transforms),
                () => draw(gamePhase.switch == `a` ? game_corridor_door_open_svg : game_corridor_door_closed_svg, transforms)
              )
              break
            case `closedDoor`:
              switchAt(
                gamePhase.switchChanged,
                () => draw(gamePhase.switch == `a` ? game_corridor_door_open_svg : game_corridor_door_closed_svg, transforms),
                () => draw(gamePhase.switch == `b` ? game_corridor_door_open_svg : game_corridor_door_closed_svg, transforms)
              )
              break
          }
        }
      )
    }
  }

  const steps = 8
  const walkDuration = 1

  switchAt(gamePhase.taken,
    () => {
      iterativeAnimation(
        gamePhase.startedWalking,
        walkDuration / steps,
        steps,
        i => draw(
          game_player_walk_svg,
          [
            translate(
              (gamePhase.x - facingX[gamePhase.facing] * (steps - i) / steps) * roomSpacing,
              (gamePhase.y - facingY[gamePhase.facing] * (steps - i) / steps) * roomSpacing
            ),
            rotate(facingDegrees[gamePhase.facing]),
            scaleY(i % 2 ? 1 : -1)
          ]),
        ended => loop(
          ended,
          [
            [0.5, () => draw(game_player_idle_a_svg, [translate(gamePhase.x * roomSpacing, gamePhase.y * roomSpacing), rotate(facingDegrees[gamePhase.facing])])],
            [0.5, () => draw(game_player_idle_b_svg, [translate(gamePhase.x * roomSpacing, gamePhase.y * roomSpacing), rotate(facingDegrees[gamePhase.facing])])]
          ]
        )
      )
    }, () => {
      iterativeAnimation(
        gamePhase.startedWalking,
        walkDuration / steps,
        steps,
        i => draw(
          game_player_silhouette_svg,
          [
            translate(
              (gamePhase.x - facingX[gamePhase.facing] * (steps - i) / steps) * roomSpacing,
              (gamePhase.y - facingY[gamePhase.facing] * (steps - i) / steps) * roomSpacing
            ),
            rotate(facingDegrees[gamePhase.facing]),
            scaleY(i % 2 ? 1 : -1)
          ]
        )
      )
    }
  )

  const keySpacing = 34
  function key(x: number, y: number, label: string, facing: Facing, keyCode: KeyCode): void {
    x -= 0.5
    y -= 0.5
    const transforms = [translate(safeAreaWidthVirtualPixels - keySpacing * x, safeAreaHeightVirtualPixels - keySpacing * y)]
    draw(game_hud_key_svg, transforms)
    draw(font[label], transforms)
    hitbox(keySpacing, keySpacing, transforms, press)
    mapKey(keyCode, press)
    function press(): void {
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
            gamePhase.won = now + walkDuration
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
                gamePhase.switchChanged = now + walkDuration
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
      } else {
        gamePhase.startedWalking = now - walkDuration
      }
    }
  }
  key(1, 1, `d`, `east`, `KeyD`)
  key(2, 1, `s`, `south`, `KeyS`)
  key(2, 2, `w`, `north`, `KeyW`)
  key(3, 1, `a`, `west`, `KeyA`)

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

  after(gamePhase.won, () => {
    const buttonWidth = 218
    const buttonHeight = 32
    const messageY = halfSafeAreaHeightVirtualPixels - buttonHeight * 1.5
    write(halfSafeAreaWidthVirtualPixels, messageY, `nice job`)
    const nextY = messageY + buttonHeight
    const nextTransforms = [translate(halfSafeAreaWidthVirtualPixels, nextY)]
    draw(game_hud_button_svg, nextTransforms)
    write(halfSafeAreaWidthVirtualPixels, nextY, `next`)
    hitbox(buttonWidth, buttonHeight, nextTransforms, () => enterGamePhase(gamePhase.level + 1))

    const retryY = nextY + buttonHeight
    const retryTransforms = [translate(halfSafeAreaWidthVirtualPixels, retryY)]
    draw(game_hud_button_svg, retryTransforms)
    write(halfSafeAreaWidthVirtualPixels, retryY, `retry`)
    hitbox(buttonWidth, buttonHeight, retryTransforms, () => enterGamePhase(gamePhase.level))

    const menuY = retryY + buttonHeight
    const menuTransforms = [translate(halfSafeAreaWidthVirtualPixels, menuY)]
    draw(game_hud_button_svg, menuTransforms)
    write(halfSafeAreaWidthVirtualPixels, menuY, `level select`)
    hitbox(buttonWidth, buttonHeight, menuTransforms, () => enterPhase({ type: `levelSelect` }))
  })
}
