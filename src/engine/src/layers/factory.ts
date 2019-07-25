type EngineSvg = readonly [number, number, string]

type LayerFactory = (
  viewportMinimumWidthVirtualPixels: number,
  viewportMaximumWidthVirtualPixels: number,
  viewportMinimumHeightVirtualPixels: number,
  viewportMaximumHeightVirtualPixels: number,
  viewportHorizontalAlignmentSignedUnitInterval: number,
  viewportVerticalAlignmentSignedUnitInterval: number,
  render: (
    draw: (
      src: EngineSvg,
      transforms: ReadonlyArray<EngineTransform>
    ) => void,
    hitbox: (
      widthVirtualPixels: number,
      heightVirtualPixels: number,
      transforms: ReadonlyArray<EngineTransform>,
      callback: EngineMutationCallback
    ) => void
  ) => void
) => void
