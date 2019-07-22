type EngineSvg = readonly [number, number, string]

type LayerFactory = (
  viewportMinimumWidthVirtualPixels: number,
  viewportMaximumWidthVirtualPixels: number,
  viewportMinimumHeightVirtualPixels: number,
  viewportMaximumHeightVirtualPixels: number,
  viewportHorizontalAlignmentSignedUnitInterval: number,
  viewportVerticalAlignmentSignedUnitInterval: number,
  render: (
    state: Readonly<State>,
    draw: (
      src: EngineSvg,
      transforms: ReadonlyArray<EngineTransform>
    ) => void,
    hitbox: (
      widthVirtualPixels: number,
      heightVirtualPixels: number,
      transforms: ReadonlyArray<EngineTransform>,
      callback: EngineMutationCallback
    ) => void,
    now: number,
    at: (
      time: number,
      callback: EngineMutationCallback
    ) => void,
    animation: (
      start: number,
      frames: ReadonlyArray<readonly [number, () => void]>,
      pastEnd?: (
        ended: number
      ) => void
    ) => void,
    loop: (
      start: number,
      frames: ReadonlyArray<readonly [number, () => void]>
    ) => void
  ) => void
) => void
