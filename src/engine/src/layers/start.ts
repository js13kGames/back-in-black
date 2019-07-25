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
      const xOffset = `${(viewportElementWidthVirtualPixels - viewportMinimumWidthVirtualPixels) * viewportHorizontalAlignmentUnitInterval}px`

      const viewportElementHeightVirtualPixels = Math.min(displayHeightVirtualPixels, viewportCropHeightVirtualPixels)
      viewportElement.style.top = `${(displayHeightVirtualPixels - viewportElementHeightVirtualPixels) * viewportVerticalAlignmentUnitInterval * displayPixelsPerVirtualPixel}px`
      viewportElement.style.height = `${viewportElementHeightVirtualPixels}px`
      const yOffset = `${(viewportElementHeightVirtualPixels - viewportMinimumHeightVirtualPixels) * viewportVerticalAlignmentUnitInterval}px`

      while (viewportElement.firstChild !== null) {
        viewportElement.removeChild(viewportElement.firstChild)
      }

      render(
        (
          svg,
          transforms
        ): void => {
          const spriteElement = document.createElement(`img`)
          spriteElement.style.position = `absolute`
          spriteElement.style.pointerEvents = `none`
          spriteElement.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + svg[0] + '" height="' + svg[1] + '"><' + svg[2] + "></svg>")}`
          spriteElement.style.left = xOffset
          spriteElement.style.top = yOffset
          spriteElement.style.marginLeft = `${-svg[0] / 2}px`
          spriteElement.style.marginTop = `${-svg[1] / 2}px`
          spriteElement.style.transform = transforms.join(` `)
          viewportElement.insertBefore(spriteElement, null)
        },
        (
          width,
          height,
          transforms,
          callback
        ) => {
          const hitboxElement = document.createElement(`div`)
          function handler(
            e: Event
          ): void {
            if (engineEarliestTimer !== null) {
              const timeOfRender = +new Date
              const elapsed = Math.min(
                engineEarliestTimer.at - now,
                timeOfRender - engineTimeOfLastRender
              )
              now += elapsed
            }
            engineExecuteMutationCallback(callback)
            e.preventDefault()
          }
          hitboxElement.onmousedown = handler
          hitboxElement.ontouchstart = handler
          hitboxElement.style.position = `absolute`
          hitboxElement.style.left = xOffset
          hitboxElement.style.top = yOffset
          hitboxElement.style.width = `${width}px`
          hitboxElement.style.height = `${height}px`
          hitboxElement.style.marginLeft = `${-width / 2}px`
          hitboxElement.style.marginTop = `${-height / 2}px`
          hitboxElement.style.transform = transforms.join(` `)
          viewportElement.insertBefore(hitboxElement, null)
        }
      )
    })
  })
}
