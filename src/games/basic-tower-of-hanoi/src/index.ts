const version = 0
const beatsPerMinute = 1

type State = {
  lifting: null | {
    readonly piece: number
    readonly fromTower: number
  }
  readonly towers: ReadonlyArray<number[]>
}

function initial(): State {
  return {
    lifting: null,
    towers: [[0, 1, 2, 3, 4], [], []]
  }
}

const safeAreaWidthVirtualPixels = 300
const safeAreaHeightVirtualPixels = 200
const fullWidthVirtualPixels = safeAreaWidthVirtualPixels * 2
const fullHeightVirtualPixels = safeAreaHeightVirtualPixels * 2
const halfSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels / 2
const halfSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels / 2
const towerWidthVirtualPixels = safeAreaWidthVirtualPixels / 3
const halfTowerWidthVirtualPixels = towerWidthVirtualPixels / 2
const pieceHeightVirtualPixels = 20

const pieces = [piece0_svg, piece1_svg, piece2_svg, piece3_svg, piece4_svg]

function render(): undefined | (() => void) {
  const mainViewport = viewport(
    safeAreaWidthVirtualPixels, safeAreaHeightVirtualPixels,
    fullWidthVirtualPixels, fullHeightVirtualPixels,
    0, 0
  )

  sprite(mainViewport, background_svg)

  const won = state.towers[2].length === 5
  let xVirtualPixels = -towerWidthVirtualPixels
  for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
    const towerValues = state.towers[towerIndex]
    let yVirtualPixels = 175.5 - halfSafeAreaHeightVirtualPixels
    for (const piece of towerValues) {
      const pieceSprite = sprite(mainViewport, pieces[piece])
      translate(pieceSprite, xVirtualPixels, yVirtualPixels)
      yVirtualPixels -= pieceHeightVirtualPixels
    }
    if (state.lifting === null && towerValues.length && !won) {
      hitbox(
        mainViewport,
        xVirtualPixels - halfTowerWidthVirtualPixels, -halfSafeAreaHeightVirtualPixels,
        towerWidthVirtualPixels, safeAreaHeightVirtualPixels,
        () => {
          state.lifting = {
            piece: towerValues[towerValues.length - 1],
            fromTower: towerIndex
          }
          towerValues.pop()
        }
      )
    } else if (state.lifting !== null && (!towerValues.length || state.lifting.piece > towerValues[towerValues.length - 1])) {
      const lifting = state.lifting
      lifting
      hitbox(
        mainViewport,
        xVirtualPixels - halfTowerWidthVirtualPixels, -halfSafeAreaHeightVirtualPixels,
        towerWidthVirtualPixels, safeAreaHeightVirtualPixels,
        () => {
          towerValues.push(lifting.piece)
          state.lifting = null
        }
      )
    }
    xVirtualPixels += towerWidthVirtualPixels
  }
  if (state.lifting !== null) {
    const liftingSprite = sprite(mainViewport, pieces[state.lifting.piece])
    translate(liftingSprite, towerWidthVirtualPixels * (state.lifting.fromTower - 1), -40)
  }
  if (won) {
    sprite(mainViewport, win_svg)
  }
  hitbox(
    mainViewport,
    35 / -2, 25 - halfSafeAreaHeightVirtualPixels - 37.5 / 2,
    35, 37.5,
    () => state = initial()
  )

  return
}

function audioReady(): void {
}

function renderBeat(): void {
}
