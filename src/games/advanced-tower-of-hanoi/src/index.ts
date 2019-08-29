const version = 1
const beatsPerMinute = 120

type State = {
  action:
  | {
    readonly type: `none`
  }
  | {
    readonly type: `rising`
    readonly piece: number
    readonly fromTower: number
  }
  | {
    readonly type: `landing`
    readonly piece: number
    readonly fromTower: number
    readonly toTower: number
  }
  readonly towers: ReadonlyArray<number[]>
}

function initial(): State {
  return {
    action: { type: `none` },
    towers: [[0, 1, 2, 3, 4], [], []]
  }
}

const safeAreaWidthVirtualPixels = 426
const safeAreaHeightVirtualPixels = 240
const halfSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels / 2
const halfSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels / 2

const towerWidthVirtualPixels = safeAreaWidthVirtualPixels / 3

const pieceHeightVirtualPixels = 19

function audioReady(): void {
}

function renderBeat(): void {
}

const pieceAtRestShadows = [
  piece0AtRestShadow_svg,
  piece1AtRestShadow_svg,
  piece2AtRestShadow_svg,
  piece3AtRestShadow_svg,
  piece4AtRestShadow_svg,
]

const piecesAtRest = [
  piece0AtRest_svg,
  piece1AtRest_svg,
  piece2AtRest_svg,
  piece3AtRest_svg,
  piece4AtRest_svg,
]

const rising0 = [
  risingBig0_svg,
  risingBig0_svg,
  risingSmall0_svg,
  risingSmall0_svg,
  risingSmall0_svg,
]

const rising1 = [
  risingBig1_svg,
  risingBig1_svg,
  risingSmall1_svg,
  risingSmall1_svg,
  risingSmall1_svg,
]

const landing0 = [
  landingBig0_svg,
  landingBig0_svg,
  landingSmall0_svg,
  landingSmall0_svg,
  landingSmall0_svg,
]

const landing1 = [
  landingBig1_svg,
  landingBig1_svg,
  landingSmall1_svg,
  landingSmall1_svg,
  landingSmall1_svg,
]

const piecesHovering0 = [
  piece0Hovering0_svg,
  piece1Hovering0_svg,
  piece2Hovering0_svg,
  piece3Hovering0_svg,
  piece4Hovering0_svg,
]

const pieceHoveringShadows0 = [
  piece0Hovering0Shadow_svg,
  piece1Hovering0Shadow_svg,
  piece2Hovering0Shadow_svg,
  piece3Hovering0Shadow_svg,
  piece4Hovering0Shadow_svg,
]

const piecesHovering1 = [
  piece0Hovering1_svg,
  piece1Hovering1_svg,
  piece2Hovering1_svg,
  piece3Hovering1_svg,
  piece4Hovering1_svg,
]

const pieceHoveringShadows1 = [
  piece0Hovering1Shadow_svg,
  piece1Hovering1Shadow_svg,
  piece2Hovering1Shadow_svg,
  piece3Hovering1Shadow_svg,
  piece4Hovering1Shadow_svg,
]

const millisecondsPerVirtualPixel = 1
const millisecondsPerFrame = 100

function render(): void {
  const mainViewport = viewport(
    safeAreaWidthVirtualPixels, safeAreaHeightVirtualPixels,
    640, 480,
    0, 0,
  )

  sprite(mainViewport, background_svg)
  const pieceShadows = group(mainViewport)
  translate(pieceShadows, 55, 10)

  sprite(mainViewport, foreground_svg)
  const pieces = group(mainViewport)

  let x = -towerWidthVirtualPixels
  for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
    let y = 84
    for (const piece of state.towers[towerIndex]) {
      const backgroundSprite = sprite(pieceShadows, pieceAtRestShadows[piece])
      translate(backgroundSprite, x, y)
      const foregroundSprite = sprite(pieces, piecesAtRest[piece])
      translate(foregroundSprite, x, y)
      y -= pieceHeightVirtualPixels
    }
    x += towerWidthVirtualPixels
  }

  switch (state.action.type) {
    case `none`: {
      let x = towerWidthVirtualPixels * -1.5
      for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
        const towerValue = state.towers[towerIndex]
        if (towerValue.length) {
          hitbox(mainViewport, x, -halfSafeAreaHeightVirtualPixels, towerWidthVirtualPixels, safeAreaWidthVirtualPixels, () => {
            state.action = {
              type: `rising`,
              piece: towerValue[towerValue.length - 1],
              fromTower: towerIndex,
            }
            towerValue.length--
          })
        }
        x += towerWidthVirtualPixels
      }
      phase()
    } break

    case `rising`: {
      const action = state.action
      const pieceX = towerWidthVirtualPixels * (action.fromTower - 1)
      const fromY = 84 - state.towers[action.fromTower].length * pieceHeightVirtualPixels
      const toY = -70
      const duration = (fromY - toY) * millisecondsPerVirtualPixel

      const backgroundSprite = sprite(pieceShadows, pieceAtRestShadows[action.piece])
      const rising0Sprite = sprite(pieces, rising0[action.piece])
      const foregroundSprite = sprite(pieces, piecesAtRest[action.piece])
      translate(backgroundSprite, pieceX, fromY)
      translate(rising0Sprite, pieceX, fromY - 40)
      translate(foregroundSprite, pieceX, fromY)
      linear(backgroundSprite)
      linear(foregroundSprite)

      elapse(millisecondsPerFrame)

      hide(rising0Sprite)
      const rising1Sprite = sprite(pieces, rising1[action.piece])
      translate(rising1Sprite, pieceX, fromY - 40)

      elapse(millisecondsPerFrame)

      hide(rising1Sprite)

      elapse(Math.max(0, duration - millisecondsPerFrame * 2))

      translateY(backgroundSprite, toY - fromY)
      translateY(foregroundSprite, toY - fromY)
      stepEnd(backgroundSprite)
      stepEnd(foregroundSprite)
      hide(backgroundSprite)
      hide(foregroundSprite)

      phase()

      const hovering0ShadowSprite = sprite(pieceShadows, pieceHoveringShadows0[action.piece])
      const hovering0Sprite = sprite(pieces, piecesHovering0[action.piece])
      translate(hovering0ShadowSprite, pieceX, toY)
      translate(hovering0Sprite, pieceX, toY)

      elapse(350)

      hide(hovering0ShadowSprite)
      hide(hovering0Sprite)
      const hovering1ShadowSprite = sprite(pieceShadows, pieceHoveringShadows1[action.piece])
      const hovering1Sprite = sprite(pieces, piecesHovering1[action.piece])
      translate(hovering1ShadowSprite, pieceX, toY)
      translate(hovering1Sprite, pieceX, toY)

      elapse(350)

      let x = towerWidthVirtualPixels * -1.5
      for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
        const towerValue = state.towers[towerIndex]
        if (!towerValue.length || towerValue[towerValue.length - 1] < action.piece) {
          hitbox(mainViewport, x, -halfSafeAreaHeightVirtualPixels, towerWidthVirtualPixels, safeAreaWidthVirtualPixels, () => state.action = {
            type: `landing`,
            piece: action.piece,
            fromTower: action.fromTower,
            toTower: towerIndex,
          })
        }
        x += towerWidthVirtualPixels
      }
    } break

    case `landing`: {
      const action = state.action
      const fromX = towerWidthVirtualPixels * (action.fromTower - 1)
      const toX = towerWidthVirtualPixels * (action.toTower - 1)
      const fromY = -70
      const toY = 84 - state.towers[action.toTower].length * pieceHeightVirtualPixels
      const xDuration = (Math.abs(toX - fromX)) * millisecondsPerVirtualPixel
      const yDuration = (toY - fromY) * millisecondsPerVirtualPixel

      const backgroundSprite = sprite(pieceShadows, pieceAtRestShadows[action.piece])
      const landing0Sprite = sprite(pieces, landing0[action.piece])
      const landing1Sprite = sprite(pieces, landing1[action.piece])
      const foregroundSprite = sprite(pieces, piecesAtRest[action.piece])

      translate(backgroundSprite, fromX, fromY)
      translate(foregroundSprite, fromX, fromY)
      linear(backgroundSprite)
      linear(foregroundSprite)
      hide(landing0Sprite)
      hide(landing1Sprite)

      elapse(xDuration)

      translateX(backgroundSprite, toX - fromX)
      translateX(foregroundSprite, toX - fromX)
      linear(backgroundSprite)
      linear(foregroundSprite)

      elapse(yDuration)

      translateY(backgroundSprite, toY - fromY)
      translateY(foregroundSprite, toY - fromY)

      translate(landing0Sprite, toX, toY - 40)
      show(landing0Sprite)

      elapse(millisecondsPerFrame)

      hide(landing0Sprite)
      show(landing1Sprite)
      translate(landing1Sprite, toX, toY - 40)

      elapse(millisecondsPerFrame)

      hide(landing1Sprite)

      phase()

      if (state.towers[2].length == 4 && action.toTower == 2) {
        sprite(mainViewport, win_svg)
      } else {
        let x = towerWidthVirtualPixels * -1.5
        for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
          const towerValue = state.towers[towerIndex]
          if (towerValue.length || towerIndex == action.toTower) {
            hitbox(mainViewport, x, -halfSafeAreaHeightVirtualPixels, towerWidthVirtualPixels, safeAreaWidthVirtualPixels, () => {
              state.towers[action.toTower].push(action.piece)
              state.action = {
                type: `rising`,
                piece: towerValue[towerValue.length - 1],
                fromTower: towerIndex,
              }
              towerValue.length--
            })
          }
          x += towerWidthVirtualPixels
        }
      }
    } break
  }

  hitbox(mainViewport, -70, -115, 140, 40, () => state = initial())
}
