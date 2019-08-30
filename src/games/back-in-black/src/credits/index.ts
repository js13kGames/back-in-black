function renderNonInteractiveCredits(
  parent: EngineViewport | EngineAnimation,
): () => (undefined | (() => void)) {
  const starfieldA = sprite(parent, levelSelect_background_starfield_svg)
  const starfieldB = sprite(parent, levelSelect_background_starfield_svg)
  translateY(starfieldB, -doubleSafeAreaHeightVirtualPixels)
  linear(starfieldA)
  linear(starfieldB)
  sprite(parent, levelSelect_background_vignette_svg)
  const upperGroup = group(parent)
  translateY(upperGroup, -20)
  write(upperGroup, `thanks for playing`)
  const lowerGroup = group(parent)
  translateY(lowerGroup, 20)
  write(lowerGroup, `2019 jameswilddev`)
  return () => {
    elapse(3000)
    translateY(starfieldA, doubleSafeAreaHeightVirtualPixels)
    translateY(starfieldB, doubleSafeAreaHeightVirtualPixels)
    return undefined
  }
}

function renderInteractiveCredits(
  mainViewport: EngineViewport,
): void {
  hitbox(
    mainViewport,
    -safeAreaWidthVirtualPixels, -safeAreaHeightVirtualPixels,
    doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
    () => enterMode({
      type: `title`
    })
  )
}
