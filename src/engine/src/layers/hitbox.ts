function hitbox(
  widthVirtualPixels: number,
  heightVirtualPixels: number,
  transforms: ReadonlyArray<EngineTransform>,
  callback: EngineMutationCallback
): void {
  const hitboxElement = document.createElement(`div`)
  function handler(
    e: Event
  ): void {
    engineLayersPrepareForInputCallback()
    callback()
    engineRender()
    e.preventDefault()
  }
  hitboxElement.onmousedown = handler
  hitboxElement.ontouchstart = handler
  hitboxElement.style.position = `absolute`
  hitboxElement.style.left = engineXOffset
  hitboxElement.style.top = engineYOffset
  hitboxElement.style.width = `${widthVirtualPixels}px`
  hitboxElement.style.height = `${heightVirtualPixels}px`
  hitboxElement.style.marginLeft = `${-widthVirtualPixels / 2}px`
  hitboxElement.style.marginTop = `${-heightVirtualPixels / 2}px`
  hitboxElement.style.transform = transforms.join(` `)
  engineCurrentViewportElement.insertBefore(hitboxElement, null)
}
