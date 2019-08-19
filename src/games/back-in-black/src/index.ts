const version = 5
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
  switchChanged: number
  x: number
  y: number
  facing: Facing
  taken?: number
  startedWalking: number
  won?: number
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
    started: 0 // now
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
  phase
  // if (state.started + transitionDuration <= now) {
  //   state.from = state.to
  //   state.to = phase
  //   state.started = now
  // }
}

function enterGamePhase(level: number): void {
  level
  // const levelValue = levels[level]
  // const goal = levelValue.corridors.filter(corridor => corridor.type == `goal`)[0]
  // enterPhase({
  //   type: `game`,
  //   level,
  //   switch: `a`,
  //   switchChanged: now,
  //   x: goal.x,
  //   y: goal.y,
  //   facing: facingReverse[goal.facing],
  //   startedWalking: now + 0.25
  // })
}

function renderPhase(phase: Phase): void {
  phase
  // switch (phase.type) {
  //   case `title`:
  //     draw(background_title_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
  //     hitbox(
  //       doubleSafeAreaWidthVirtualPixels,
  //       doubleSafeAreaHeightVirtualPixels,
  //       [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)],
  //       () => enterPhase({
  //         type: `levelSelect`
  //       })
  //     )
  //     break
  //   case `levelSelect`:
  //     draw(background_levelSelect_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
  //     hitbox(
  //       doubleSafeAreaWidthVirtualPixels,
  //       doubleSafeAreaHeightVirtualPixels,
  //       [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)],
  //       () => enterGamePhase(0)
  //     )
  //     break
  //   case `game`:
  //     renderGame(phase)
  //     break
  // }
}

function layers(
  // layer: LayerFactory
): void {
  // layer(
  //   safeAreaWidthVirtualPixels, doubleSafeAreaWidthVirtualPixels,
  //   safeAreaHeightVirtualPixels, doubleSafeAreaHeightVirtualPixels,
  //   0, 0,
  //   () => {
  //     iterativeAnimation(
  //       state.started,
  //       transitionFrameDuration,
  //       transitionFrames.length - 1,
  //       i => {
  //         renderPhase(state.from)

  //         for (let j = 0; j < i; j++) {
  //           draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
  //         }
  //       },
  //       started => iterativeAnimation(
  //         started,
  //         transitionFrameDuration,
  //         transitionFrames.length - 1,
  //         i => {
  //           renderPhase(state.to)

  //           for (let j = i; j < transitionFrames.length; j++) {
  //             draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
  //           }
  //         },
  //         () => renderPhase(state.to)
  //       )
  //     )
  //   }
  // )
}

function audioReady(): () => void {
  return () => {
  }
}
