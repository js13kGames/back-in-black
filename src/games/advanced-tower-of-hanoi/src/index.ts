const version = 0
const beatsPerMinute = 120

const enum Tower {
  Start,
  Middle,
  Goal
}

const enum Piece {
  A,
  B,
  C,
  D,
  E
}

type State = {
  lift: null | {
    readonly started: number
    readonly tower: Tower
    readonly piece: Piece
    drop: null | {
      readonly started: number
      readonly tower: Tower
    }
  }
  readonly towers: ReadonlyArray<Piece[]>
}

function initial(): State {
  return {
    lift: null,
    towers: [[Piece.A, Piece.B, Piece.C, Piece.D, Piece.E], [], []]
  }
}

const safeAreaWidthVirtualPixels = 426
const safeAreaHeightVirtualPixels = 240

const towerWidthVirtualPixels = safeAreaWidthVirtualPixels / 3

const pieceHeightVirtualPixels = 19

const enum PieceFrame {
  AtRest,
  Hovering0,
  Hovering1
}

const enum PieceFrameLayer {
  Foreground,
  Shadow
}

const pieceFrames: {
  readonly [piece in Piece]: {
    readonly [frame in PieceFrame]: {
      readonly [layer in PieceFrameLayer]: EngineSvg
    }
  }
} = [
    [
      [piece0AtRest_svg, piece0AtRestShadow_svg],
      [piece0Hovering0_svg, piece0Hovering0Shadow_svg],
      [piece0Hovering1_svg, piece0Hovering1Shadow_svg]
    ],
    [
      [piece1AtRest_svg, piece1AtRestShadow_svg],
      [piece1Hovering0_svg, piece1Hovering0Shadow_svg],
      [piece1Hovering1_svg, piece1Hovering1Shadow_svg]
    ],
    [
      [piece2AtRest_svg, piece2AtRestShadow_svg],
      [piece2Hovering0_svg, piece2Hovering0Shadow_svg],
      [piece2Hovering1_svg, piece2Hovering1Shadow_svg]
    ],
    [
      [piece3AtRest_svg, piece3AtRestShadow_svg],
      [piece3Hovering0_svg, piece3Hovering0Shadow_svg],
      [piece3Hovering1_svg, piece3Hovering1Shadow_svg]
    ],
    [
      [piece4AtRest_svg, piece4AtRestShadow_svg],
      [piece4Hovering0_svg, piece4Hovering0Shadow_svg],
      [piece4Hovering1_svg, piece4Hovering1Shadow_svg]
    ]
  ]

const enum EffectFrame {
  Rising0,
  Rising1,
  Landing0,
  Landing1
}

const effectFrames: {
  readonly [piece in Piece]: {
    readonly [frame in EffectFrame]: EngineSvg
  }
} = [
    [
      risingBig0_svg,
      risingBig1_svg,
      landingBig0_svg,
      landingBig1_svg
    ],
    [
      risingBig0_svg,
      risingBig1_svg,
      landingBig0_svg,
      landingBig1_svg
    ],
    [
      risingBig0_svg,
      risingBig1_svg,
      landingBig0_svg,
      landingBig1_svg
    ],
    [
      risingSmall0_svg,
      risingSmall1_svg,
      landingSmall0_svg,
      landingSmall1_svg
    ],
    [
      risingSmall0_svg,
      risingSmall1_svg,
      landingSmall0_svg,
      landingSmall1_svg
    ]
  ]

function layers(
  layer: LayerFactory
): void {
  layer(
    safeAreaWidthVirtualPixels, 640,
    safeAreaHeightVirtualPixels, 480,
    0, 0,
    () => {
      hitbox
      const drawnPieces: {
        readonly x: number
        readonly y: number
        readonly piece: Piece
        readonly frame: PieceFrame
      }[] = []

      const drawnEffects: {
        readonly x: number
        readonly y: number
        readonly piece: Piece
        readonly frame: EffectFrame
      }[] = []

      function drawPiece(
        towerIndex: Tower,
        pieceIndex: number,
        piece: Piece,
        frame: PieceFrame
      ): void {
        drawnPieces.push({
          x: (towerIndex + 0.5) * towerWidthVirtualPixels,
          y: pieceIndex * -pieceHeightVirtualPixels + 204,
          piece,
          frame
        })
      }

      function drawEffect(
        towerIndex: Tower,
        pieceIndex: number,
        piece: Piece,
        frame: EffectFrame
      ): void {
        drawnEffects.push({
          x: (towerIndex + 0.5) * towerWidthVirtualPixels,
          y: pieceIndex * -pieceHeightVirtualPixels + 154,
          piece,
          frame
        })
      }

      function towerHitbox(
        towerIndex: Tower,
        callback: EngineMutationCallback
      ): void {
        hitbox(
          towerWidthVirtualPixels,
          240,
          [translate((towerIndex + 0.5) * towerWidthVirtualPixels, 120)],
          callback
        )
      }

      for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
        const towerValue = state.towers[towerIndex]
        for (let pieceIndex = 0; pieceIndex < towerValue.length; pieceIndex++) {
          const pieceValue = towerValue[pieceIndex]
          drawPiece(towerIndex, pieceIndex, pieceValue, PieceFrame.AtRest)
        }
      }

      let won = false
      const lift = state.lift
      if (lift) {
        const piece = lift.piece
        const liftTower = lift.tower
        const drop = lift.drop
        if (drop) {
          const dropTower = drop.tower
          const heightOfDropTower = state.towers[dropTower].length
          won = !state.towers[Tower.Start].length
            && !state.towers[Tower.Middle].length
            && dropTower === Tower.Goal
          const liftedAndDroppedInSameTower = dropTower === liftTower
          const timeSpentMovingBetweenTowers = liftedAndDroppedInSameTower ? 0 : 0.25
          animation(
            drop.started,
            [
              [timeSpentMovingBetweenTowers, () => drawPiece(linearInterpolate(liftTower, dropTower, 1 / 2), 8, piece, PieceFrame.AtRest)],
              [timeSpentMovingBetweenTowers, () => drawPiece(dropTower, 8, piece, PieceFrame.AtRest)],
              [0.25, () => {
                drawPiece(dropTower, linearInterpolate(8, heightOfDropTower, 1 / 2), piece, PieceFrame.AtRest)
              }],
              [0.25, () => {
                drawPiece(dropTower, heightOfDropTower, piece, PieceFrame.AtRest)
                drawEffect(dropTower, heightOfDropTower, piece, EffectFrame.Landing0)
              }],
              [0.25, () => {
                drawPiece(dropTower, heightOfDropTower, piece, PieceFrame.AtRest)
                drawEffect(dropTower, heightOfDropTower, piece, EffectFrame.Landing1)
              }]
            ],
            () => drawPiece(dropTower, heightOfDropTower, piece, PieceFrame.AtRest)
          )
          if (!won) {
            for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
              const towerValue = state.towers[towerIndex]
              if (towerValue.length || towerIndex === dropTower) {
                towerHitbox(towerIndex, () => {
                  state.towers[dropTower].push(piece)
                  state.lift = {
                    started: now,
                    piece: towerValue[towerValue.length - 1],
                    tower: towerIndex,
                    drop: null
                  }
                  towerValue.pop()
                })
              }
            }
          }
        } else {
          const heightOfLiftTower = state.towers[liftTower].length
          animation(
            lift.started,
            [
              [0.25, () => {
                drawEffect(liftTower, heightOfLiftTower, piece, EffectFrame.Rising0)
                drawPiece(liftTower, heightOfLiftTower, piece, PieceFrame.AtRest)
              }],
              [0.25, () => {
                drawEffect(liftTower, heightOfLiftTower, piece, EffectFrame.Rising1)
                drawPiece(liftTower, linearInterpolate(heightOfLiftTower, 8, 1 / 2), piece, PieceFrame.AtRest)
              }]
            ],
            ended => loop(
              ended,
              [
                [0.5, () => drawPiece(liftTower, 8, piece, PieceFrame.Hovering0)],
                [0.5, () => drawPiece(liftTower, 8, piece, PieceFrame.Hovering1)]
              ]
            )
          )
          for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
            const towerValue = state.towers[towerIndex]
            if (!towerValue.length || towerValue[towerValue.length - 1] < piece) {
              towerHitbox(towerIndex, () => {
                lift.drop = {
                  started: now,
                  tower: towerIndex
                }
              })
            }
          }
        }
      } else {
        for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
          const towerValue = state.towers[towerIndex]
          if (towerValue.length) {
            towerHitbox(towerIndex, () => {
              state.lift = {
                started: now,
                piece: towerValue[towerValue.length - 1],
                tower: towerIndex,
                drop: null
              }
              towerValue.pop()
            })
          }
        }
      }

      draw(background_svg, [translate(213, 120)])

      for (const drawnPiece of drawnPieces) {
        draw(pieceFrames[drawnPiece.piece][drawnPiece.frame][PieceFrameLayer.Shadow], [translate(drawnPiece.x + 50, drawnPiece.y + 20)])
      }

      draw(foreground_svg, [translate(213, 120)])

      for (const drawnEffect of drawnEffects) {
        draw(effectFrames[drawnEffect.piece][drawnEffect.frame], [translate(drawnEffect.x, drawnEffect.y)])
      }

      for (const drawnPiece of drawnPieces) {
        draw(pieceFrames[drawnPiece.piece][drawnPiece.frame][PieceFrameLayer.Foreground], [translate(drawnPiece.x, drawnPiece.y)])
      }

      if (won) {
        draw(win_svg, [translate(213, 120)])
      }

      hitbox(140, 40, [translate(213, 24)], () => state = initial())
    }
  )
}

function audioReady(): () => void {
  return () => {
  }
}
