const enum EngineViewportKey {
  // This must share an index with EngineNodeKey.Element.
  InnerElement,
  OuterElement,
  MinimumWidthVirtualPixels,
  MinimumHeightVirtualPixels,
  CropWidthVirtualPixels,
  CropHeightVirtualPixels,
  HorizontalAlignmentUnitInterval,
  VerticalAlignmentUnitInterval,
}

type EngineViewport = readonly [
  HTMLElement,
  HTMLElement,
  number,
  number,
  number,
  number,
  number,
  number,
]

const engineViewports: EngineViewport[] = []

function engineViewportsCreate(
  minimumWidthVirtualPixels: number,
  minimumHeightVirtualPixels: number,
  maximumWidthVirtualPixels: number,
  maximumHeightVirtualPixels: number,
  horizontalAlignmentSignedUnitInterval: number,
  verticalAlignmentSignedUnitInterval: number,
): EngineViewport {
  const outerElement = document.createElement(`div`)
  outerElement.style.position = `fixed`
  outerElement.style.overflow = `hidden`
  outerElement.style.transformOrigin = `0 0`
  outerElement.style.userSelect = `none`
  outerElement.style.touchAction = `manipulation`

  const innerElement = document.createElement(`div`)
  innerElement.style.position = `absolute`

  outerElement.appendChild(innerElement)

  const horizontalAlignmentUnitInterval = horizontalAlignmentSignedUnitInterval * 0.5 + 0.5
  const verticalAlignmentUnitInterval = verticalAlignmentSignedUnitInterval * 0.5 + 0.5
  const horizontalAlignmentHalfAbsSignedUnitInterval = Math.abs(horizontalAlignmentSignedUnitInterval) * 0.5
  const verticalAlignmentHalfAbsSignedUnitInterval = Math.abs(verticalAlignmentSignedUnitInterval) * 0.5
  const differenceBetweenMinimumAndMaximumWidthVirtualPixels = maximumWidthVirtualPixels - minimumWidthVirtualPixels
  const differenceBetweenMinimumAndMaximumHeightVirtualPixels = maximumHeightVirtualPixels - minimumHeightVirtualPixels
  const cropWidthVirtualPixels = maximumWidthVirtualPixels - differenceBetweenMinimumAndMaximumWidthVirtualPixels * horizontalAlignmentHalfAbsSignedUnitInterval
  const cropHeightVirtualPixels = maximumHeightVirtualPixels - differenceBetweenMinimumAndMaximumHeightVirtualPixels * verticalAlignmentHalfAbsSignedUnitInterval

  const viewport: EngineViewport = [
    innerElement,
    outerElement,
    minimumWidthVirtualPixels,
    minimumHeightVirtualPixels,
    cropWidthVirtualPixels,
    cropHeightVirtualPixels,
    horizontalAlignmentUnitInterval,
    verticalAlignmentUnitInterval,
  ]
  engineViewports.push(viewport)
  return viewport
}

function engineViewportsRender(): void {
  for (const viewport of engineViewports) {
    document.body.removeChild(viewport[EngineViewportKey.OuterElement])
  }
  engineViewports.length = 0

  render()

  engineViewportsResize()

  for (const viewport of engineViewports) {
    document.body.appendChild(viewport[EngineViewportKey.OuterElement])
  }
}

function engineViewportsResize(): void {
  const displayWidthDisplayPixels = innerWidth
  const displayHeightDisplayPixels = innerHeight
  for (const viewport of engineViewports) {
    const horizontalDisplayPixelsPerVirtualPixel = displayWidthDisplayPixels / viewport[EngineViewportKey.MinimumWidthVirtualPixels]
    const verticalDisplayPixelsPerVirtualPixel = displayHeightDisplayPixels / viewport[EngineViewportKey.MinimumHeightVirtualPixels]
    const displayPixelsPerVirtualPixel = Math.min(horizontalDisplayPixelsPerVirtualPixel, verticalDisplayPixelsPerVirtualPixel)

    const displayWidthVirtualPixels = displayWidthDisplayPixels / displayPixelsPerVirtualPixel
    const displayHeightVirtualPixels = displayHeightDisplayPixels / displayPixelsPerVirtualPixel
    viewport[EngineViewportKey.OuterElement].style.transform = `scale(${displayPixelsPerVirtualPixel})`

    const viewportElementWidthVirtualPixels = Math.min(displayWidthVirtualPixels, viewport[EngineViewportKey.CropWidthVirtualPixels])
    viewport[EngineViewportKey.OuterElement].style.left = `${(displayWidthVirtualPixels - viewportElementWidthVirtualPixels) * viewport[EngineViewportKey.HorizontalAlignmentUnitInterval] * displayPixelsPerVirtualPixel}`
    viewport[EngineViewportKey.OuterElement].style.width = `${viewportElementWidthVirtualPixels}`
    viewport[EngineViewportKey.InnerElement].style.left = `${viewport[EngineViewportKey.MinimumWidthVirtualPixels] / 2 + (viewportElementWidthVirtualPixels - viewport[EngineViewportKey.MinimumWidthVirtualPixels]) * viewport[EngineViewportKey.HorizontalAlignmentUnitInterval]}`

    const viewportElementHeightVirtualPixels = Math.min(displayHeightVirtualPixels, viewport[EngineViewportKey.CropHeightVirtualPixels])
    viewport[EngineViewportKey.OuterElement].style.top = `${(displayHeightVirtualPixels - viewportElementHeightVirtualPixels) * viewport[EngineViewportKey.VerticalAlignmentUnitInterval] * displayPixelsPerVirtualPixel}`
    viewport[EngineViewportKey.OuterElement].style.height = `${viewportElementHeightVirtualPixels}`
    viewport[EngineViewportKey.InnerElement].style.top = `${viewport[EngineViewportKey.MinimumHeightVirtualPixels] / 2 + (viewportElementHeightVirtualPixels - viewport[EngineViewportKey.MinimumHeightVirtualPixels]) * viewport[EngineViewportKey.VerticalAlignmentUnitInterval]}`
  }
}
