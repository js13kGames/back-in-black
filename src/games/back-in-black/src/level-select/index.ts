function renderNonInteractiveLevelSelect(
  parent: EngineViewport | EngineAnimation,
): () => (undefined | (() => void)) {
  sprite(parent, levelSelect_background_svg)
  return () => { return undefined }
}

function renderInteractiveLevelSelect(
  mainViewport: EngineViewport,
): void {
  hitbox(
    mainViewport,
    -safeAreaWidthVirtualPixels, -safeAreaHeightVirtualPixels,
    doubleSafeAreaWidthVirtualPixels, doubleSafeAreaHeightVirtualPixels,
    () => enterGameMode(0)
  )
}
