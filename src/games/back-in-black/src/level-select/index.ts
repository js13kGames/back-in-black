function levelSelectMenu(): Menu {
  const options: MenuOption[] = []
  for (let i = 0; i < state.unlockedLevels; i++) {
    options.push({
      label: levels[i].name,
      callback(): void {
        enterGameMode(i)
      },
    })
  }
  return {
    title: `level select`,
    options,
  }
}

function renderNonInteractiveLevelSelect(
  parent: EngineViewport | EngineAnimation,
): () => (undefined | (() => void)) {
  const starfieldA = sprite(parent, levelSelect_background_starfield_svg)
  const starfieldB = sprite(parent, levelSelect_background_starfield_svg)
  translateY(starfieldB, -doubleSafeAreaHeightVirtualPixels)
  linear(starfieldA)
  linear(starfieldB)
  sprite(parent, levelSelect_background_vignette_svg)
  renderNonInteractiveMenu(parent, levelSelectMenu(), false)
  return () => {
    elapse(3000)
    translateY(starfieldA, doubleSafeAreaHeightVirtualPixels)
    translateY(starfieldB, doubleSafeAreaHeightVirtualPixels)
    return undefined
  }
}

function renderInteractiveLevelSelect(
  mainViewport: EngineViewport,
): void {
  renderInteractiveMenu(mainViewport, levelSelectMenu())
}
