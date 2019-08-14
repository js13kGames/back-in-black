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

function layers(
  layer: LayerFactory
): void {
  layer(
    safeAreaWidthVirtualPixels, fullWidthVirtualPixels,
    safeAreaHeightVirtualPixels, fullHeightVirtualPixels,
    0, 0,
    (draw, hitbox) => {
      draw(background_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
      const won = state.towers[2].length === 5
      let xVirtualPixels = halfTowerWidthVirtualPixels
      for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
        const towerValues = state.towers[towerIndex]
        let yVirtualPixels = 175.5
        for (const piece of towerValues) {
          draw(pieces[piece], [translate(xVirtualPixels, yVirtualPixels)])
          yVirtualPixels -= pieceHeightVirtualPixels
        }
        if (state.lifting === null && towerValues.length && !won) {
          hitbox(towerWidthVirtualPixels, safeAreaHeightVirtualPixels, [translate(xVirtualPixels, halfSafeAreaHeightVirtualPixels)], () => {
            state.lifting = {
              piece: towerValues[towerValues.length - 1],
              fromTower: towerIndex
            }
            towerValues.pop()
          })
        } else if (state.lifting !== null && (!towerValues.length || state.lifting.piece > towerValues[towerValues.length - 1])) {
          const lifting = state.lifting
          hitbox(towerWidthVirtualPixels, safeAreaHeightVirtualPixels, [translate(xVirtualPixels, halfSafeAreaHeightVirtualPixels)], () => {
            towerValues.push(lifting.piece)
            state.lifting = null
          })
        }
        xVirtualPixels += towerWidthVirtualPixels
      }
      if (state.lifting !== null) {
        draw(pieces[state.lifting.piece], [translate(halfTowerWidthVirtualPixels + towerWidthVirtualPixels * state.lifting.fromTower, 65)])
      }
      if (won) {
        draw(win_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
      }
      hitbox(
        35,
        37.5,
        [translate(halfSafeAreaWidthVirtualPixels, 25)],
        () => state = initial()
      )
    }
  )
}

function audioReady(): () => void {
  return () => {
  }
}
