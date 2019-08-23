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

function mapKey(
  key: EngineKeyCode,
  callback: EngineMutationCallback
): void {
  engineKeyInputCallbacks[key] = callback
}

function save<T extends EngineJson>(name: string, content: T): Truthiness {
  return engineSave(`${gameName}-${name}`, content)
}

function load<T extends EngineJson>(name: string): null | T {
  return engineLoad(`${gameName}-${name}`)
}

function drop(name: string): Truthiness {
  return engineDrop(`${gameName}-${name}`)
}
