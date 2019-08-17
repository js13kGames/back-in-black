type EngineSvg = readonly [number, number, string]

type LayerFactory = (
  viewportMinimumWidthVirtualPixels: number,
  viewportMaximumWidthVirtualPixels: number,
  viewportMinimumHeightVirtualPixels: number,
  viewportMaximumHeightVirtualPixels: number,
  viewportHorizontalAlignmentSignedUnitInterval: number,
  viewportVerticalAlignmentSignedUnitInterval: number,
  render: () => void
) => void
