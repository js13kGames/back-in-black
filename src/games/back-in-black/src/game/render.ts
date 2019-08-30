const keys: ReadonlyArray<{
  readonly facing: Facing
  readonly keycode: KeyCode
  readonly text: string
  readonly x: number
  readonly y: number
}> = [{
  facing: `north`,
  keycode: `KeyW`,
  text: `w`,
  x: -2,
  y: -2,
}, {
  facing: `east`,
  keycode: `KeyD`,
  text: `d`,
  x: -1,
  y: -1,
}, {
  facing: `south`,
  keycode: `KeyS`,
  text: `s`,
  x: -2,
  y: -1,
}, {
  facing: `west`,
  keycode: `KeyA`,
  text: `a`,
  x: -3,
  y: -1,
}]

function postGameMenu(
  mode: GameMode,
): Menu {
  return {
    title: `nice job`,
    options: [{
      label: `next`,
      callback(): void {
        mode.walking = false
        enterGameMode(mode.level + 1)
      }
    }, {
      label: `retry`,
      callback(): void {
        mode.walking = false
        enterGameMode(mode.level)
      }
    }, {
      label: `level select`,
      callback(): void {
        mode.walking = false
        enterMode({
          type: `levelSelect`
        })
      }
    }]
  }
}

function renderNonInteractiveGame(
  parent: EngineViewport | EngineAnimation,
  mode: GameMode,
): () => (undefined | (() => void)) {
  parent
  mode
  return () => { return undefined }
}

function renderInteractiveGame(
  mainViewport: EngineViewport,
  mode: GameMode,
): void {
  mainViewport
  mode
}
