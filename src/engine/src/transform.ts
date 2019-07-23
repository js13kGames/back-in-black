type EngineTransform = string

function translateX(
  virtualPixels: number
): EngineTransform {
  return `translateX(${virtualPixels}px)`
}

function translateY(
  virtualPixels: number
): EngineTransform {
  return `translateY(${virtualPixels}px)`
}

function translate(
  xVirtualPixels: number,
  yVirtualPixels: number
): EngineTransform {
  return `translate(${xVirtualPixels}px, ${yVirtualPixels}px)`
}

function rotate(
  degreeClockwise: number
): EngineTransform {
  return `rotate(${degreeClockwise}deg)`
}

function scaleX(
  factor: number
): EngineTransform {
  return `scaleX(${factor})`
}

function scaleY(
  factor: number
): EngineTransform {
  return `scaleY(${factor})`
}

function scale(
  xFactor: number,
  yFactor: number
): EngineTransform {
  return `scale(${xFactor}, ${yFactor})`
}

function scaleUniform(
  factor: number
): EngineTransform {
  return `scale(${factor})`
}
