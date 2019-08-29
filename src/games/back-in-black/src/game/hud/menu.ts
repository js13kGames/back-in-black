type Menu = {
  readonly title: string
  readonly options: ReadonlyArray<{
    readonly label: string
    callback(): void
  }>
}

function renderNonInteractiveMenu(
  parent: EngineViewport | EngineAnimation,
  menu: Menu,
  enter: boolean,
): void {
  let y = menu.options.length * -16
  const title = group(parent)
  write(title, menu.title)
  translateY(title, y)
  if (enter) {
    hide(title)
    scaleX(title, 0.1)
    easeOut(title)
    elapse(120)
    show(title)
    scaleX(title, 10)
  }
  y += 32
  for (const option of menu.options) {
    const optionGroup = group(parent)
    translateY(optionGroup, y)
    sprite(optionGroup, game_hud_button_svg)
    write(optionGroup, option.label)
    if (enter) {
      hide(optionGroup)
      scaleX(optionGroup, 0.1)
      easeOut(optionGroup)
      elapse(120)
      show(optionGroup)
      scaleX(optionGroup, 10)
    }
    y += 32
  }
}

function renderInteractiveMenu(
  mainViewport: EngineViewport,
  menu: Menu,
): void {
  let y = (menu.options.length - 1) * -16
  for (const option of menu.options) {
    hitbox(mainViewport, -109, y, 218, 32, option.callback)
    y += 32
  }
}
