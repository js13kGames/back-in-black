function engineHitboxesCreate(
  viewport: EngineViewport,
  leftVirtualPixels: number,
  topVirtualPixels: number,
  widthVirtualPixels: number,
  heightVirtualPixels: number,
  callback: () => void,
): void {
  const element = document.createElement(`div`)
  element.style.position = `absolute`
  element.style.left = `${leftVirtualPixels}`
  element.style.top = `${topVirtualPixels}`
  element.style.width = `${widthVirtualPixels}`
  element.style.height = `${heightVirtualPixels}`
  element.onmousedown = handler
  element.ontouchstart = handler
  function handler(
    e: Event
  ): void {
    e.preventDefault()
    callback()
    engineRender()
  }
  viewport[EngineViewportKey.InnerElement].appendChild(element)
}
