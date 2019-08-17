function draw(
  svg: EngineSvg,
  transforms: ReadonlyArray<EngineTransform>
): void {
  const spriteElement = document.createElement(`img`)
  spriteElement.style.position = `absolute`
  spriteElement.style.pointerEvents = `none`
  spriteElement.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + svg[0] + '" height="' + svg[1] + '"><' + svg[2] + "></svg>")}`
  spriteElement.style.left = engineXOffset
  spriteElement.style.top = engineYOffset
  spriteElement.style.marginLeft = `${-svg[0] / 2}px`
  spriteElement.style.marginTop = `${-svg[1] / 2}px`
  spriteElement.style.transform = transforms.join(` `)
  engineCurrentViewportElement.insertBefore(spriteElement, null)
}
