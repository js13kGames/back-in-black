function engineCreateLayers(): void {
  layers((
    viewportMinimumWidthVirtualPixels,
    viewportMaximumWidthVirtualPixels,
    viewportMinimumHeightVirtualPixels,
    viewportMaximumHeightVirtualPixels,
    viewportHorizontalAlignmentSignedUnitInterval,
    viewportVerticalAlignmentSignedUnitInterval,
    render
  ): void => {
    const viewportElement = document.createElement(`div`)
    viewportElement.style.position = `fixed`
    viewportElement.style.overflow = `hidden`
    viewportElement.style.transformOrigin = `0 0`
    document.body.appendChild(viewportElement)

    const viewportHorizontalAlignmentUnitInterval = viewportHorizontalAlignmentSignedUnitInterval * 0.5 + 0.5
    const viewportVerticalAlignmentUnitInterval = viewportVerticalAlignmentSignedUnitInterval * 0.5 + 0.5
    const viewportHorizontalAlignmentHalfAbsSignedUnitInterval = Math.abs(viewportHorizontalAlignmentSignedUnitInterval) * 0.5
    const viewportVerticalAlignmentHalfAbsSignedUnitInterval = Math.abs(viewportVerticalAlignmentSignedUnitInterval) * 0.5
    const viewportDifferenceBetweenMinimumAndMaximumWidthVirtualPixels = viewportMaximumWidthVirtualPixels - viewportMinimumWidthVirtualPixels
    const viewportDifferenceBetweenMinimumAndMaximumHeightVirtualPixels = viewportMaximumHeightVirtualPixels - viewportMinimumHeightVirtualPixels
    const viewportCropWidthVirtualPixels = viewportMaximumWidthVirtualPixels - viewportDifferenceBetweenMinimumAndMaximumWidthVirtualPixels * viewportHorizontalAlignmentHalfAbsSignedUnitInterval
    const viewportCropHeightVirtualPixels = viewportMaximumHeightVirtualPixels - viewportDifferenceBetweenMinimumAndMaximumHeightVirtualPixels * viewportVerticalAlignmentHalfAbsSignedUnitInterval

    engineRenderCallbacks.push(() => {
      const displayWidthDisplayPixels = innerWidth
      const displayHeightDisplayPixels = innerHeight

      const horizontalDisplayPixelsPerVirtualPixel = displayWidthDisplayPixels / viewportMinimumWidthVirtualPixels
      const verticalDisplayPixelsPerVirtualPixel = displayHeightDisplayPixels / viewportMinimumHeightVirtualPixels
      const displayPixelsPerVirtualPixel = Math.min(horizontalDisplayPixelsPerVirtualPixel, verticalDisplayPixelsPerVirtualPixel)

      const displayWidthVirtualPixels = displayWidthDisplayPixels / displayPixelsPerVirtualPixel
      const displayHeightVirtualPixels = displayHeightDisplayPixels / displayPixelsPerVirtualPixel
      viewportElement.style.transform = `scale(${displayPixelsPerVirtualPixel})`

      const viewportElementWidthVirtualPixels = Math.min(displayWidthVirtualPixels, viewportCropWidthVirtualPixels)
      viewportElement.style.left = `${(displayWidthVirtualPixels - viewportElementWidthVirtualPixels) * viewportHorizontalAlignmentUnitInterval * displayPixelsPerVirtualPixel}px`
      viewportElement.style.width = `${viewportElementWidthVirtualPixels}px`
      engineXOffset = `${(viewportElementWidthVirtualPixels - viewportMinimumWidthVirtualPixels) * viewportHorizontalAlignmentUnitInterval}px`

      const viewportElementHeightVirtualPixels = Math.min(displayHeightVirtualPixels, viewportCropHeightVirtualPixels)
      viewportElement.style.top = `${(displayHeightVirtualPixels - viewportElementHeightVirtualPixels) * viewportVerticalAlignmentUnitInterval * displayPixelsPerVirtualPixel}px`
      viewportElement.style.height = `${viewportElementHeightVirtualPixels}px`
      engineYOffset = `${(viewportElementHeightVirtualPixels - viewportMinimumHeightVirtualPixels) * viewportVerticalAlignmentUnitInterval}px`

      while (viewportElement.firstChild !== null) {
        viewportElement.removeChild(viewportElement.firstChild)
      }

      engineCurrentViewportElement = viewportElement

      render()
    })
  })
}
