const version = 2
const beatsPerMinute = 80

type Facing =
  | `north`
  | `east`
  | `south`
  | `west`

const facingDegrees: { readonly [facing in Facing]: number } = {
  north: 270,
  east: 0,
  south: 90,
  west: 180,
}

const facingReverse: { readonly [facing in Facing]: Facing } = {
  north: `south`,
  east: `west`,
  south: `north`,
  west: `east`
}

const facingX: { readonly [facing in Facing]: number } = {
  north: 0,
  east: 1,
  south: 0,
  west: -1
}

const facingY: { readonly [facing in Facing]: number } = {
  north: -1,
  east: 0,
  south: 1,
  west: 0
}

type Phase = {
  type: `blank`
} | {
  type: `title`
} | {
  type: `levelSelect`
} | {
  type: `game`
  readonly level: number
  switch: `a` | `b`
  x: number
  y: number
  facing: Facing
  taken: boolean
  startedWalking: number
}

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

const font: { readonly [character: string]: EngineSvg } = {
  a: font_a_svg,
  b: font_b_svg,
  c: font_c_svg,
  d: font_d_svg,
  e: font_e_svg,
  f: font_f_svg,
  g: font_g_svg,
  h: font_h_svg,
  i: font_i_svg,
  j: font_j_svg,
  k: font_k_svg,
  l: font_l_svg,
  m: font_m_svg,
  n: font_n_svg,
  o: font_o_svg,
  p: font_p_svg,
  q: font_q_svg,
  r: font_r_svg,
  s: font_s_svg,
  t: font_t_svg,
  u: font_u_svg,
  v: font_v_svg,
  w: font_w_svg,
  x: font_x_svg,
  y: font_y_svg,
  z: font_z_svg,
  0: font_number0_svg,
  1: font_number1_svg,
  2: font_number2_svg,
  3: font_number3_svg,
  4: font_number4_svg,
  5: font_number5_svg,
  6: font_number6_svg,
  7: font_number7_svg,
  8: font_number8_svg,
  9: font_number9_svg,
  ",": font_comma_svg
}

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

const levels: ReadonlyArray<{
  readonly name: string
  readonly rooms: ReadonlyArray<{
    readonly type: `empty` | `mcguffin` | `switch`
    readonly x: number
    readonly y: number
  }>
  readonly corridors: ReadonlyArray<{
    readonly type: `empty` | `ledge` | `stairs` | `openDoor` | `closedDoor` | `goal`
    readonly x: number
    readonly y: number
    readonly facing: Facing
  }>
}> = [{
  name: `get in,get it,get out`,
  rooms: [{
    type: `mcguffin`,
    x: 1,
    y: 3
  }, {
    type: `empty`,
    x: 2,
    y: 3
  }, {
    type: `empty`,
    x: 2,
    y: 2
  }, {
    type: `empty`,
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
  }, {
    type: `empty`,
    x: 6,
    y: 4
  }, {
    type: `empty`,
    x: 6,
    y: 3
  }, {
    type: `empty`,
    x: 7,
    y: 3
  }],
  corridors: [{
    type: `empty`,
    x: 2,
    y: 3,
    facing: `west`
  }, {
    type: `empty`,
    x: 2,
    y: 2,
    facing: `south`
  }, {
    type: `empty`,
    x: 3,
    y: 2,
    facing: `west`
  }, {
    type: `empty`,
    x: 4,
    y: 2,
    facing: `west`
  }, {
    type: `empty`,
    x: 4,
    y: 3,
    facing: `north`
  }, {
    type: `empty`,
    x: 4,
    y: 4,
    facing: `north`
  }, {
    type: `empty`,
    x: 5,
    y: 4,
    facing: `west`
  }, {
    type: `empty`,
    x: 6,
    y: 4,
    facing: `west`
  }, {
    type: `empty`,
    x: 6,
    y: 3,
    facing: `south`
  }, {
    type: `empty`,
    x: 7,
    y: 3,
    facing: `west`
  }, {
    type: `goal`,
    x: 7,
    y: 3,
    facing: `east`
  }]
}]

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

function drawPhase(phase: Phase): void {
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
          drawPhase(state.from)

          for (let j = 0; j < i; j++) {
            draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
          }
        },
        started => iterativeAnimation(
          started,
          transitionFrameDuration,
          transitionFrames.length - 1,
          i => {
            drawPhase(state.to)

            for (let j = i; j < transitionFrames.length; j++) {
              draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
            }
          },
          () => drawPhase(state.to)
        )
      )
    }
  )
}

function audioReady(): () => void {
  return () => {
  }
}
