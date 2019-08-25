const version = 6
const beatsPerMinute = 80

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
  walked?: Truthiness
  state: `initial` | `taken` | `won`
}

type TransitionPhase = {
  readonly type: `transition`
  readonly from?: Phase
  readonly to: Phase
}

type Phase =
  | TitlePhase
  | LevelSelectPhase
  | GamePhase
  | TransitionPhase

type State = {
  unlockedLevels: number
  root: Phase
}

function initial(): State {
  return {
    unlockedLevels: 1,
    root: {
      type: `transition`,
      to: {
        type: `title`
      }
    }
  }
}

const roomSpacing = 42
const safeAreaWidthVirtualPixels = roomSpacing * 8
const safeAreaHeightVirtualPixels = roomSpacing * 6
const halfSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels / 2
const halfSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels / 2
const doubleSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels * 2
const doubleSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels * 2

const transitionFrames: ReadonlyArray<EngineSpritesSvg> = [
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
const transitionFrameDuration = 30

function enterPhase(phase: Phase): void {

  state.root = {
    type: `transition`,
    from: state.root.type == `transition` ? state.root.to : state.root,
    to: phase
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
    state: `initial`,
  })
}

function renderNonInteractivePhase(
  parent: EngineViewport | EngineAnimation,
  phase_: Phase,
): () => void {
  switch (phase_.type) {
    case `title`:
      sprite(parent, background_title_svg)
      return phase
    case `levelSelect`:
      sprite(parent, background_levelSelect_svg)
      return phase
    case `game`:
      return renderNonInteractiveGame(parent, phase_)
    case `transition`:
      if (phase_.from) {
        const fromContainer = group(parent)
        renderNonInteractivePhase(fromContainer, phase_.from)

        const toContainer = group(parent)
        hide(toContainer)
        const animateTo = renderNonInteractivePhase(toContainer, phase_.to)

        return () => {
          const sprites: EngineAnimation[] = []
          for (const frame of transitionFrames) {
            sprites.push(sprite(parent, frame))
            elapse(transitionFrameDuration)
          }
          hide(fromContainer)

          show(toContainer)
          for (const frame of sprites) {
            hide(frame)
            elapse(transitionFrameDuration)
          }

          animateTo()
        }
      } else {
        const animateTo = renderNonInteractivePhase(parent, phase_.to)

        const sprites: EngineAnimation[] = []
        for (const frame of transitionFrames) {
          sprites.push(sprite(parent, frame))
        }

        return () => {
          for (const frame of sprites) {
            hide(frame)
            elapse(transitionFrameDuration)
          }

          animateTo()
        }
      }
  }
}

function renderInteractivePhase(
  mainViewport: EngineViewport,
  phase: Phase,
): void {
  switch (phase.type) {
    case `title`:
      sprite(mainViewport, background_title_svg)
      hitbox(
        mainViewport,
        -safeAreaWidthVirtualPixels, -safeAreaHeightVirtualPixels,
        doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
        () => enterPhase({
          type: `levelSelect`
        })
      )
      break
    case `levelSelect`:
      hitbox(
        mainViewport,
        -safeAreaWidthVirtualPixels, -safeAreaHeightVirtualPixels,
        doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
        () => enterGamePhase(0)
      )
      break
    case `game`:
      renderInteractiveGame(mainViewport, phase)
      break
    case `transition`:
      renderInteractivePhase(mainViewport, phase.to)
      break
  }
}

function render(): void {
  const mainViewport = viewport(
    safeAreaWidthVirtualPixels, safeAreaHeightVirtualPixels,
    doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
    0, 0,
  )

  renderNonInteractivePhase(mainViewport, state.root)()
  renderInteractivePhase(mainViewport, state.root)
}

function audioReady(): () => void {
  return () => {
  }
}
