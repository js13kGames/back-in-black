const version = 2
const beatsPerMinute = 80

type BlankPhase = {
  type: `blank`
}

type TitlePhase = {
  type: `title`
}

type LevelSelectPhase = {
  type: `levelSelect`
}

type GamePhase = {
  type: `game`
  readonly level: number
  switch: `a` | `b`
  x: number
  y: number
  facing: Facing
  taken: boolean
  startedWalking: number
}

type Phase =
  | BlankPhase
  | TitlePhase
  | LevelSelectPhase
  | GamePhase

type State = {
  unlockedLevels: number
  from: Phase
  to: Phase
  started: number
}

function initial(): State {
  return {
    unlockedLevels: 1,
    from: {
      type: `blank`
    },
    to: {
      type: `title`
    },
    started: now
  }
}

const roomSpacing = 42
const safeAreaWidthVirtualPixels = roomSpacing * 8
const safeAreaHeightVirtualPixels = roomSpacing * 6
const halfSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels / 2
const halfSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels / 2
const doubleSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels * 2
const doubleSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels * 2

const transitionFrames: ReadonlyArray<EngineSvg> = [
  transition_a_svg,
  transition_b_svg,
  transition_c_svg,
  transition_d_svg,
  transition_e_svg,
  transition_f_svg,
  transition_g_svg,
  transition_h_svg,
  transition_i_svg
]
const transitionDuration = 1.2
const transitionFrameDuration = transitionDuration / (transitionFrames.length * 2 - 1)

function enterPhase(phase: Phase): void {
  if (state.started + transitionDuration <= now) {
    state.from = state.to
    state.to = phase
    state.started = now
  }
}

function enterGamePhase(level: number): void {
  const levelValue = levels[level]
  const goal = levelValue.corridors.filter(corridor => corridor.type == `goal`)[0]
  enterPhase({
    type: `game`,
    level,
    switch: `a`,
    x: goal.x,
    y: goal.y,
    facing: facingReverse[goal.facing],
    taken: false,
    startedWalking: now + 0.25
  })
}

function renderPhase(phase: Phase): void {
  switch (phase.type) {
    case `title`:
      draw(background_title_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
      hitbox(
        doubleSafeAreaWidthVirtualPixels,
        doubleSafeAreaHeightVirtualPixels,
        [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)],
        () => enterPhase({
          type: `levelSelect`
        })
      )
      break
    case `levelSelect`:
      draw(background_levelSelect_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
      hitbox(
        doubleSafeAreaWidthVirtualPixels,
        doubleSafeAreaHeightVirtualPixels,
        [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)],
        () => enterGamePhase(0)
      )
      break
    case `game`:
      const gamePhase = phase
      draw(background_game_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
      const level = levels[gamePhase.level]
      for (const room of level.rooms) {
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
      }

      for (const corridor of level.corridors) {
        const transforms = [
          translate(corridor.x * roomSpacing, corridor.y * roomSpacing),
          rotate(facingDegrees[corridor.facing])
        ]
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
          case `goal`:
            draw(corridor_goal_closed_svg, transforms)
            break
        }
      }

      const steps = 8
      iterativeAnimation(
        gamePhase.startedWalking,
        0.125,
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
                canPass = gamePhase.taken
                break
            }
            break
          }

          gamePhase.facing = facing

          if (canPass) {
            gamePhase.x += facingX[facing]
            gamePhase.y += facingY[facing]
            gamePhase.startedWalking = now
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
      break
  }
}

function layers(
  layer: LayerFactory
): void {
  layer(
    safeAreaWidthVirtualPixels, doubleSafeAreaWidthVirtualPixels,
    safeAreaHeightVirtualPixels, doubleSafeAreaHeightVirtualPixels,
    0, 0,
    () => {
      iterativeAnimation(
        state.started,
        transitionFrameDuration,
        transitionFrames.length - 1,
        i => {
          renderPhase(state.from)

          for (let j = 0; j < i; j++) {
            draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
          }
        },
        started => iterativeAnimation(
          started,
          transitionFrameDuration,
          transitionFrames.length - 1,
          i => {
            renderPhase(state.to)

            for (let j = i; j < transitionFrames.length; j++) {
              draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
            }
          },
          () => renderPhase(state.to)
        )
      )
    }
  )
}

function audioReady(): () => void {
  return () => {
  }
}
