let state: State

let saveLoadAvailable: Truthiness

let audioContext: AudioContext

type Truthiness = 1 | undefined

type Json = EngineJson

function linearInterpolate(
  from: number,
  to: number,
  mixUnitInterval: number
): number {
  return from + (to - from) * mixUnitInterval
}

function dotProduct(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return x1 * x2 + y1 * y2
}

function magnitudeSquared(
  x: number,
  y: number
): number {
  return dotProduct(x, y, x, y)
}

function magnitude(
  x: number,
  y: number
): number {
  return Math.sqrt(magnitudeSquared(x, y))
}

function distanceSquared(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return magnitudeSquared(x2 - x1, y2 - y1)
}

function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return magnitude(x2 - x1, y2 - y1)
}

type KeyCode = EngineKeyCode

function elapse(
  milliseconds: number,
): void {
  engineAnimationsElapse(milliseconds)
}

function phase(): void {
  engineAnimationsPhase()
}

function viewport(
  minimumWidthVirtualPixels: number,
  minimumHeightVirtualPixels: number,
  maximumWidthVirtualPixels: number,
  maximumHeightVirtualPixels: number,
  horizontalAlignmentSignedUnitInterval: number,
  verticalAlignmentSignedUnitInterval: number,
): EngineViewport {
  return engineViewportsCreate(
    minimumWidthVirtualPixels,
    minimumHeightVirtualPixels,
    maximumWidthVirtualPixels,
    maximumHeightVirtualPixels,
    horizontalAlignmentSignedUnitInterval,
    verticalAlignmentSignedUnitInterval,
  )
}

function group(
  parent: EngineViewport | EngineAnimation,
): EngineAnimation {
  return engineGroupsCreate(parent)
}

function sprite(
  parent: EngineViewport | EngineAnimation,
  svg: EngineSpritesSvg,
): EngineAnimation {
  return engineSpritesCreate(parent, svg)
}

function hitbox(
  viewport: EngineViewport,
  leftVirtualPixels: number,
  topVirtualPixels: number,
  widthVirtualPixels: number,
  heightVirtualPixels: number,
  callback: () => void,
): void {
  engineHitboxesCreate(
    viewport,
    leftVirtualPixels,
    topVirtualPixels,
    widthVirtualPixels,
    heightVirtualPixels,
    callback
  )
}

function stepEnd(
  animation: EngineAnimation,
): void {
  engineAnimationsCreateKeyframe(animation)
}

function linear(
  animation: EngineAnimation,
): void {
  engineTransformsSetEasing(animation, `linear`)
}

function easeOut(
  animation: EngineAnimation,
): void {
  engineTransformsSetEasing(animation, `ease-out`)
}

function easeIn(
  animation: EngineAnimation,
): void {
  engineTransformsSetEasing(animation, `ease-in`)
}

function easeInOut(
  animation: EngineAnimation,
): void {
  engineTransformsSetEasing(animation, `ease-in-out`)
}

function ease(
  animation: EngineAnimation,
): void {
  engineTransformsSetEasing(animation, `ease`)
}

function setOpacity(
  animation: EngineAnimation,
  opacity: number,
): void {
  engineTransformsSetOpacity(animation, opacity)
}

function hide(
  animation: EngineAnimation,
): void {
  engineTransformsSetOpacity(animation, 0)
}

function show(
  animation: EngineAnimation,
): void {
  engineTransformsSetOpacity(animation, 1)
}

function translateX(
  animation: EngineAnimation,
  virtualPixels: number,
): void {
  engineTransformsApplyTransform(animation, `translateX(${virtualPixels}px)`)
}

function translateY(
  animation: EngineAnimation,
  virtualPixels: number,
): void {
  engineTransformsApplyTransform(animation, `translateY(${virtualPixels}px)`)
}

function translate(
  animation: EngineAnimation,
  xVirtualPixels: number,
  yVirtualPixels: number,
): void {
  engineTransformsApplyTransform(animation, `translate(${xVirtualPixels}px,${yVirtualPixels}px)`)
}

function rotate(
  animation: EngineAnimation,
  degreesClockwise: number,
): void {
  engineTransformsApplyTransform(animation, `rotate(${degreesClockwise}deg)`)
}

function scaleX(
  animation: EngineAnimation,
  factor: number,
): void {
  engineTransformsApplyTransform(animation, `scaleX(${factor})`)
}

function scaleY(
  animation: EngineAnimation,
  factor: number,
): void {
  engineTransformsApplyTransform(animation, `scaleY(${factor})`)
}

function scale(
  animation: EngineAnimation,
  xFactor: number,
  yFactor: number,
): void {
  engineTransformsApplyTransform(animation, `scale(${xFactor},${yFactor})`)
}

function scaleUniform(
  animation: EngineAnimation,
  factor: number,
): void {
  engineTransformsApplyTransform(animation, `scale(${factor})`)
}

function mapKey(
  key: EngineKeyCode,
  callback: EngineMutationCallback
): void {
  engineKeyInputCallbacks[key] = callback
}

function save<T extends EngineJson>(name: string, content: T): Truthiness {
  return engineStorageSave(`${gameName}-${name}`, content)
}

function load<T extends EngineJson>(name: string): null | T {
  return engineStorageLoad(`${gameName}-${name}`)
}

function drop(name: string): Truthiness {
  return engineStorageDrop(`${gameName}-${name}`)
}
