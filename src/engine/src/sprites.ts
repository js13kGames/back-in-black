type EngineSpritesSvg = readonly [number, number, string]

function engineSpritesCreate(
  parent: EngineViewport | EngineAnimation,
  svg: EngineSpritesSvg,
): EngineAnimation {
  const element = document.createElement(`img`)
  element.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${svg[0]}" height="${svg[1]}"><${svg[2]}></svg>`)}`
  element.style.marginLeft = `${svg[0] / -2}`
  element.style.marginTop = `${svg[1] / -2}`
  return engineAnimationsCreate(parent, element)
}
