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
  setUpWhiteNoise()
  setUpKick()
  setUpSnare()
  setUpHat()
  setUpBass()
  setUpLead()
  setUpPad()
  return () => {
    // const beat = now % 80
    // const bar = (beat - (beat % 4)) / 4

    // switch (beat) {
    //   case 16:
    //   case 20:
    //   case 24:
    //   case 32:
    //   case 36:
    //   case 40:
    //   case 48:
    //   case 64:
    //     bassOn(0, 2)
    //     break

    //   case 17:
    //   case 21:
    //   case 25:
    //   case 33:
    //   case 37:
    //   case 41:
    //   case 49:
    //   case 65:
    //     bassOff(0)
    //     bassOn(0.5, 2)
    //     break

    //   case 18:
    //   case 22:
    //   case 26:
    //   case 34:
    //   case 38:
    //   case 42:
    //   case 50:
    //   case 66:
    //     bassOff(0)
    //     bassOn(0.25, 2)
    //     bassOff(0.75)
    //     break

    //   case 19:
    //   case 23:
    //   case 27:
    //   case 35:
    //   case 39:
    //   case 43:
    //   case 51:
    //   case 67:
    //     bassOn(0, 2)
    //     bassOn(0.25, 2)
    //     bassOff(0.5)
    //     break

    //   case 28:
    //   case 44:
    //   case 52:
    //   case 60:
    //   case 68:
    //   case 76:
    //     bassOn(0, 3)
    //     break

    //   case 29:
    //   case 45:
    //   case 53:
    //   case 61:
    //   case 69:
    //   case 77:
    //     bassOff(0)
    //     bassOn(0.5, 3)
    //     break

    //   case 30:
    //   case 46:
    //   case 54:
    //   case 70:
    //     bassOff(0)
    //     bassOn(0.25, 3)
    //     bassOff(0.75)
    //     break

    //   case 31:
    //   case 47:
    //   case 55:
    //   case 71:
    //     bassOn(0, 3)
    //     bassOn(0.25, 3)
    //     bassOff(0.5)
    //     break

    //   case 56:
    //   case 72:
    //     bassOn(0, 7)
    //     break

    //   case 57:
    //   case 73:
    //     bassOff(0)
    //     bassOn(0.5, 7)
    //     break

    //   case 58:
    //   case 74:
    //     bassOff(0)
    //     bassOn(0.25, 7)
    //     bassOff(0.75)
    //     break

    //   case 59:
    //   case 75:
    //     bassOn(0, 7)
    //     bassOn(0.25, 7)
    //     bassOff(0.5)
    //     break

    //   case 62:
    //   case 78:
    //     bassOff(0)
    //     bassOn(0.25, 10)
    //     bassOff(0.75)
    //     break

    //   case 63:
    //   case 79:
    //     bassOn(0, 10)
    //     bassOn(0.25, 10)
    //     bassOff(0.5)
    //     break
    // }

    // switch (beat) {
    //   case 0:
    //     bassOn(0, 2)
    //     kick(0)
    //     break
    //   case 4:
    //     bassOn(0, 3)
    //     kick(0)
    //     break
    //   case 8:
    //     bassOn(0, 7)
    //     kick(0)
    //     break
    //   case 12:
    //     bassOn(0, 3)
    //     kick(0)
    //     break
    //   case 14:
    //     bassOn(0, 10)
    //     hat(0, 0.1)
    //     break

    //   case 15:
    //     hat(0, 0.05)
    //     hat(0.5, 0.05)
    //     hat(0.75, 0.05)
    //     break

    //   case 17:
    //   case 21:
    //   case 25:
    //   case 29:
    //   case 33:
    //   case 41:
    //   case 45:
    //   case 49:
    //   case 57:
    //   case 65:
    //   case 73:
    //   case 77:
    //     snare(0)
    //     hat(0.5, 0.1)
    //     break

    //   case 18:
    //   case 22:
    //   case 26:
    //   case 30:
    //   case 34:
    //   case 42:
    //   case 50:
    //   case 58:
    //   case 66:
    //   case 74:
    //     hat(0, 0.05)
    //     hat(0.25, 0.05)
    //     kick(0.5)
    //     break

    //   case 19:
    //   case 23:
    //   case 27:
    //   case 31:
    //   case 35:
    //   case 43:
    //   case 51:
    //   case 59:
    //   case 67:
    //   case 75:
    //     snare(0)
    //     kick(0.25)
    //     hat(0, 0.1)
    //     hat(0.5, 0.05)
    //     hat(0.75, 0.05)
    //     break

    //   case 37:
    //   case 53:
    //   case 61:
    //   case 65:
    //   case 69:
    //     snare(0)
    //     hat(0, 0.1)
    //     hat(0.5, 0.05)
    //     hat(0.75, 0.05)
    //     break

    //   case 38:
    //   case 54:
    //   case 70:
    //     kick(0.5)
    //     hat(0, 0.1)
    //     hat(0.5, 0.05)
    //     hat(0.75, 0.05)
    //     break

    //   case 39:
    //   case 55:
    //   case 71:
    //     snare(0)
    //     kick(0.25)
    //     kick(0.5)
    //     kick(0.75)
    //     hat(0, 0.1)
    //     hat(0.25, 0.05)
    //     hat(0.5, 0.05)
    //     hat(0.75, 0.05)
    //     break

    //   case 46:
    //   case 78:
    //     hat(0, 0.05)
    //     hat(0.25, 0.05)
    //     kick(0.5)
    //     hat(0.5, 0.1)
    //     break

    //   case 47:
    //   case 79:
    //     kick(0.25)
    //     hat(0.25, 0.1)
    //     break

    //   case 62:
    //     kick(0.5)
    //     snare(0.75)
    //     hat(0, 0.1)
    //     hat(0.5, 0.05)
    //     hat(0.75, 0.05)
    //     break

    //   case 63:
    //     kick(0)
    //     kick(0.25)
    //     kick(0.5)
    //     snare(0.75)
    //     hat(0, 0.05)
    //     hat(0.25, 0.05)
    //     hat(0.5, 0.1)
    //     break
    // }

    // if (beat >= 16 && !(beat % 4)) {
    //   kick(0)
    //   hat(0, 0.1)
    //   hat(0.5, 0.05)
    //   hat(0.75, 0.05)
    // }

    // let padNote = 0

    // switch (bar) {
    //   case 1:
    //   case 5:
    //   case 7:
    //   case 9:
    //   case 11:
    //   case 13:

    //   case 17:
    //     padNote = 1
    //     break

    //   case 6:
    //   case 10:
    //     padNote = 2
    //     break

    //   case 3:
    //   case 15:
    //   case 19:
    //     padNote = 4
    //     break

    //   case 2:
    //   case 14:
    //   case 18:
    //     padNote = 5
    //     break
    // }

    // switch (beat % 4) {
    //   case 0:
    //     padOn(0, padNote + 5)
    //     padOn(0.25, padNote + 8)
    //     padOn(0.5, padNote + 13)
    //     padOn(0.75, padNote + 17)
    //     break
    //   case 1:
    //     padOn(0, padNote + 20)
    //     padOn(0.25, padNote + 25)
    //     padOn(0.5, padNote + 5)
    //     padOn(0.75, padNote + 8)
    //     break
    //   case 2:
    //     padOn(0, padNote + 13)
    //     padOn(0.25, padNote + 17)
    //     padOn(0.5, padNote + 20)
    //     padOn(0.75, padNote + 25)
    //     break
    //   case 3:
    //     padOn(0, padNote + 5)
    //     padOn(0.25, padNote + 8)
    //     padOn(0.5, padNote + 13)
    //     padOn(0.75, padNote + 17)
    //     break
    // }

    // if (beat < 16 || beat >= 48) {
    //   switch (beat % 8) {
    //     case 0:
    //       leadOn(0, 0, 9)
    //       leadOn(0.5, 0, 19)

    //       leadOn(0, 1, 5)
    //       leadOn(0.5, 1, 14)
    //       break
    //     case 1:
    //       leadOn(0, 0, 14)
    //       leadOn(0.5, 0, 10)

    //       leadOn(0, 1, 9)
    //       leadOn(0.5, 1, 5)
    //       break
    //     case 2:
    //       leadOn(0, 0, 7)
    //       leadOff(0.5, 0)

    //       leadOn(0, 1, 2)
    //       leadOn(0.5, 1, -2)
    //       break
    //     case 3:
    //       leadOn(0, 0, 10)
    //       leadOn(0.5, 0, 14)

    //       leadOn(0, 1, 5)
    //       leadOn(0.5, 1, 7)
    //       break
    //     case 4:
    //       leadOn(0, 0, 10)
    //       leadOn(0.5, 0, 19)

    //       leadOn(0, 1, 3)
    //       leadOn(0.5, 1, 15)
    //       break
    //     case 5:
    //       leadOff(0, 0)
    //       leadOn(0.5, 0, 15)

    //       leadOn(0, 1, 10)
    //       leadOn(0.5, 1, 5)
    //       break
    //     case 6:
    //       leadOff(0, 0)
    //       leadOn(0.5, 0, 10)

    //       leadOn(0, 1, -2)
    //       leadOn(0.5, 1, 2)
    //       break
    //     case 7:
    //       leadOff(0, 0)
    //       leadOn(0.5, 0, 14)

    //       leadOn(0, 1, 7)
    //       leadOn(0.5, 1, 10)
    //       break
    //   }
    // } else {
    //   leadOff(0, 0)
    //   leadOff(0, 1)
    // }
  }
}
