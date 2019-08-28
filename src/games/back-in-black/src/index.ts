const version = 6
const beatsPerMinute = 80

type TitleMode = {
  type: `title`
}

type LevelSelectMode = {
  type: `levelSelect`
}

type GameMode = {
  type: `game`
  readonly level: number
  switch: `a` | `b`
  x: number
  y: number
  facing: Facing
  walked?: Truthiness
  state: `initial` | `taken` | `won`
}

type TransitionMode = {
  readonly type: `transition`
  readonly from?: Mode
  readonly to: Mode
}

type Mode =
  | TitleMode
  | LevelSelectMode
  | GameMode
  | TransitionMode

type State = {
  unlockedLevels: number
  root: Mode
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
const safeAreaWidthVirtualPixels = roomSpacing * 7
const safeAreaHeightVirtualPixels = roomSpacing * 5
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

function enterMode(mode: Mode): void {

  state.root = {
    type: `transition`,
    from: state.root,
    to: mode
  }
}

function enterGameMode(level: number): void {
  const levelValue = levels[level]
  const goal = levelValue.corridors.filter(corridor => corridor.type == `goal`)[0]
  enterMode({
    type: `game`,
    level,
    switch: `a`,
    x: goal.x,
    y: goal.y,
    facing: facingReverse[goal.facing],
    walked: 1,
    state: `initial`,
  })
}

function renderNonInteractiveMode(
  parent: EngineViewport | EngineAnimation,
  mode: Mode,
): () => void {
  switch (mode.type) {
    case `title`:
      sprite(parent, background_title_svg)
      return phase
    case `levelSelect`:
      sprite(parent, background_levelSelect_svg)
      return phase
    case `game`:
      return renderNonInteractiveGame(parent, mode)
    case `transition`:
      state.root = mode.to

      if (mode.from) {
        const fromContainer = group(parent)
        renderNonInteractiveMode(fromContainer, mode.from)

        const toContainer = group(parent)
        hide(toContainer)
        const animateTo = renderNonInteractiveMode(toContainer, mode.to)

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
        const animateTo = renderNonInteractiveMode(parent, mode.to)

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

function renderInteractiveMode(
  mainViewport: EngineViewport,
  mode: Mode,
): void {
  switch (mode.type) {
    case `title`:
      sprite(mainViewport, background_title_svg)
      hitbox(
        mainViewport,
        -safeAreaWidthVirtualPixels, -safeAreaHeightVirtualPixels,
        doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
        () => enterMode({
          type: `levelSelect`
        })
      )
      break
    case `levelSelect`:
      hitbox(
        mainViewport,
        -safeAreaWidthVirtualPixels, -safeAreaHeightVirtualPixels,
        doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
        () => enterGameMode(0)
      )
      break
    case `game`:
      renderInteractiveGame(mainViewport, mode)
      break
    case `transition`:
      renderInteractiveMode(mainViewport, mode.to)
      break
  }
}

function render(): void {
  const mainViewport = viewport(
    safeAreaWidthVirtualPixels, safeAreaHeightVirtualPixels,
    doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
    0, 0,
  )

  renderNonInteractiveMode(mainViewport, state.root)()
  renderInteractiveMode(mainViewport, state.root)
}

function audioReady(): () => void {
  return () => {
  }
}
