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
  sprite(parent, levelSelect_background_svg)
  renderNonInteractiveMenu(parent, levelSelectMenu(), false)
  return () => { return undefined }
}

function renderInteractiveLevelSelect(
  mainViewport: EngineViewport,
): void {
  renderInteractiveMenu(mainViewport, levelSelectMenu())
}
